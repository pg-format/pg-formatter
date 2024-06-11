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

const valid = JSON.parse(fs.readFileSync('test/pg-format-valid.json'))
describe("parse valid snippets", () => {
  valid.forEach(({pg,about,formatted,TODO}) => {
    if (!TODO) it(about, () => { 
      const g = parse(pg)
      if (format(g) != formatted) console.log(JSON.stringify(g,null,2))
      assert.equal(format(g), formatted)
    })
  })
})

const invalid = JSON.parse(fs.readFileSync('test/pg-format-invalid.json'))
describe("detect syntax errors", () => {
  for (let pg in invalid) {
    it(invalid[pg], () => assert.throws(() => parse(pg)))
  }
});
