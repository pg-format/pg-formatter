import chai from 'chai'
import fs from 'fs'
import path from "path"

const assert = chai.assert

import { parse } from '../src/parser.js'
import { buildGraph } from '../src/for-json.js';

const suitePath = path.resolve(new URL(".", import.meta.url).pathname, "suite")
const localPath = name => path.resolve(suitePath, name)
const readFile = path => fs.readFileSync(localPath(path)).toString()

describe("parse examples", () => {
  for(let file of fs.readdirSync(suitePath).filter(file => file.match(/\.pg/))) {
      it(file, () => {
      const pg = readFile(file)
      const graph = buildGraph(parse(pg).lines)
      const jsonFile = localPath(file.replace(/\.pg$/, ".json"))
      if (fs.existsSync(jsonFile)) {
        const json = JSON.parse(readFile(jsonFile))
        assert.deepEqual(graph, json)
      }
    })
  }
})
