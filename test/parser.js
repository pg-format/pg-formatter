import chai from 'chai';
import fs from 'fs';

import { parse } from '../src/parser.js';
import { format } from '../src/formatter.js';

const assert = chai.assert;

describe("parse examples", () => {
  for (let file of fs.readdirSync("examples")) {
    it(file, () => {
      const pg = fs.readFileSync(`examples/${file}`).toString()
      assert.ok(parse(pg))
    })
  }
});

function ex(pg, about, formatted) {
  return { pg, about, formatted: formatted ?? pg }
}

const examples = [
  ex('','empty graph'),
  ex('a: :b','node id with colon'),
  ex('a\r :b', 'plain \\r is valid line break', 'a :b'),
  ex('a :""', 'empty string label'),
  ex('a : x', 'space between colon and label', 'a :x'),
  ex('a "":b', 'empty string key'),
  ex('a b:""', 'empty string value'),
  ex('a b:c:d', 'parsed as property key "b" with value "c:d"'),
  ex("x\nxy\r\nxyz # comment\n\"X\"", 'folded line',
    "x\nxy\nxyz # comment\n\"X\""),
  ex("a -> b a:\"\",2\t, -2e2,null ,\n xyz # comment", 'value list',
     'a -> b a:"",2,-200,null,xyz # comment'),
  ex('http://example.org/', 'plain URI as node ID'),
  ex('"\\u1234"', 'Unicode escape sequence'),
  ex('"\n \r \t"', 'multiline string'),
  ex('2 -> 3', 'edge identifier'),
  ex('1: 2 -> 3', 'edge identifier'),
  ex('1: -> 2', 'edge with first identifier ending in colon'),
]

describe("parse examples", () => {
  examples.forEach(({pg,about,formatted}) => {
    it(about, () => { 
      const g = parse(pg)
      if (format(g) != formatted) console.log(JSON.stringify(g,null,2))
      assert.equal(format(g), formatted)
    })
  })
})

const invalid = [
  '""',         // empty string node id
  '\x19',       // control code not allowed in unquoted identifier
  ' a',         // line must not start with space
  '\ta',        // line must not start with tab
  'a b',        // no label or property
  'a :',        // invalid label
  'a ->',       // missing id
  'a b:',       // missing property value
  '"',          // missing end of quoted string
  '"\\"',       // missing end of quoted string with escaped '
  'a :"',       // missing end of quoted string
  'a :\'\\"',   // missing end of quoted string with escaped '
  'a b:"',      // missing end of quoted string
  'a b:"\\"',   // missing end of quoted string with escaped '
  ':a',         // node ID starting with colon
  ':',          // colon as node ID
  '"\\uxxxx"',  // invalid Unicode Escape sequence
  '"\\"',       // escape sequence not closed
  '"\\x',       // unknown escape sequence
  'a : b -> d', // invalid space after edge identfier
  '`x`',        // backquoted string is not part of the specification
  '"\x0B"',     // control code in quoted string
  'a b : true', // space before/after colon of property
  'a b:c :d',   // space before/after colon of property
]

describe("detect syntax errors", () => {
  invalid.forEach((pg, i) => {
    it(`case ${i}`, () => assert.throws(() => parse(pg)))
  })
});
