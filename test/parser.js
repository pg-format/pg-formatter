const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');

const { parse } = require('../src/parser.js');

describe("parse examples", () => {
  for (let file of fs.readdirSync("examples")) {
    it(file, () => {
      const pg = fs.readFileSync(`examples/${file}`).toString()
      assert.ok(parse(pg))
    })
  }
});

const valid = [
  '',       // empty graph
  'a\r :b', // plain \r is valid line break
  'a :""',  // empty string label
  'a : x',  // space between colon and label
  'a "":b', // empty string key
  'a b:""', // empty string value
  'a b : true', // space before/after colon of proprty
  'a b:c:d',    // parsed as property key 'b' with value 'c:d'
  'a b:c :d',   // parsed as property key 'b:c' with value 'd'
  "x\nxy\r\nxyz # comment\n\"X\"", // folded line
  "a -> b a:\"\",2\t, -2e2,null ,\n xyz # comment", // value list
  'http://example.org/', // plain URI as node ID
  '"\\u1234"', // Unicode escape sequence
]

describe("parse edge cases", () => {
  valid.forEach((pg, i) => {
    it(`case ${i}`, () => assert.doesNotThrow(() => parse(pg)))
  })
});

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
  'a:',         // node ID ending with colon
  ':a',         // node ID starting with colon
  ':',          // colon as node ID
  '"\\uxxxx"',  // invalid Unicode Escape sequence
  '"\\"',       // escape sequence not closed
  '"\\x',       // unknown escape sequence
]

describe("detect syntax errors", () => {
  invalid.forEach((pg, i) => {
    it(`case ${i}`, () => assert.throws(() => parse(pg)))
  })
});
