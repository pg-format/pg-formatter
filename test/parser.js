import chai from 'chai';
import fs from 'fs';

import { parse } from '../src/parser.js';
import { format } from '../src/formatter.js';
import { buildGraph } from '../src/for-json.js';

const assert = chai.assert;

describe("parse examples", () => {
  for (let file of fs.readdirSync("examples")) {
    it(file, () => {
      const pg = fs.readFileSync(`examples/${file}`).toString()
      assert.ok(parse(pg))
    })
  }
});

// Run official PG format test suite

const valid = JSON.parse(fs.readFileSync('test/pg-format-valid.json'))
describe("parse valid snippets", () => {
  valid.forEach(({pg,about,formatted,graph}) => {
    it(about, () => { 
      const g = parse(pg)
      if (formatted) {
        if (format(g) != formatted) console.log(JSON.stringify(g,null,2))
        assert.equal(format(g), formatted)
      }
      if (graph) {
        assert.deepEqual(buildGraph(g.lines), graph)
      }
    })
  })
})

const invalid = JSON.parse(fs.readFileSync('test/pg-format-invalid.json'))
describe("detect syntax errors", () => {
  for (let pg in invalid) {
    it(invalid[pg], () => assert.throws(() => parse(pg)))
  }
});
