import chai from 'chai';
import fs from 'fs';

import { parse } from '../src/parser.js';

const assert = chai.assert;

describe("parse examples", () => {
  for (let file of fs.readdirSync("examples")) {
    it(file, () => {
      const pg = fs.readFileSync(`examples/${file}`).toString()
      assert.ok(parse(pg))
    })
  }
})
