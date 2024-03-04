const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');

const { parse } = require('../lib/parser.js');

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
  '""',     // empty string id
  'a :""',  // empty string label
  'a "":b', // empty string key
  'a b:""', // empty string value
  "x\nxy\r\nxyz # comment\n\"X\"", // folded line
  "a -> b a:\"\",2\t, -2e2,null ,\n xyz # comment", // value list
  // This should be allowed to suppor plain URI as ids
  // 'http://example.org/',
]

describe("parse edge cases", () => {
  valid.forEach((pg, i) => {
    it(`case ${i}`, () => assert.doesNotThrow(() => parse(pg)))
  })
});

const invalid = [
  ' a',         // line must not start with space
  '\ta',        // line must not start with tab
  ':a',         // missing id but label
  'a:b',        // missing id but property
  ':',          // no id
  'a b',        // no label or property
  'a :',        // invalid label
  'a ->',       // missing id
  'a b:c :d',   // label must come before properties 
  'a b:',       // missing property value
  'a:',         // invalid id (must not end with colon)        
  'a b:c:d',    // not clear where key and where value
  '"',          // missing end of quoted string
  '"\\"',       // missing end of quoted string with escaped '
  'a :"',       // missing end of quoted string
  'a :\'\\"',   // missing end of quoted string with escaped '
  'a b:"',      // missing end of quoted string
  'a b:"\\"',   // missing end of quoted string with escaped '
  '(a',         // invalid id (must not start with bracket)        
]

describe("detect syntax errors", () => {
  invalid.forEach((pg, i) => {
    it(`case ${i}`, () => assert.throws(() => parse(pg)))
  })
});
