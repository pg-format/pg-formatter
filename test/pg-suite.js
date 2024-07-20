import { assert } from 'chai'
import fs from 'fs'
import path from 'path'

import { parse } from '../src/parser.js'
import { format } from '../src/formatter.js'
import { buildGraph } from '../src/for-json.js'

const suite = path.resolve(new URL(".", import.meta.url).pathname, "pg-test-suite")
const suitePath = (...name) => path.resolve(suite, ...name)
const suiteFile = (...name) => fs.readFileSync(suitePath(...name)).toString()

const examples = fs.readdirSync(suitePath('examples')).filter(file => file.match(/\.pg/))
describe("parse examples", () => {
  for(let file of examples) {
    it(file, () => {
      const pg = suiteFile('examples',file)
      const graph = buildGraph(parse(pg))
      const jsonFile = suitePath('examples',file.replace(/\.pg$/, ".json"))
      if (fs.existsSync(jsonFile)) {
        const json = JSON.parse(suiteFile(jsonFile))
        assert.deepEqual(graph, json)
      }
    })
  }
})

const valid = JSON.parse(suiteFile('pg-format-valid.json'))
describe("parse valid test cases", () => {
  valid.forEach(({pg,about,formatted,graph}) => {
    it(about||pg, () => { 
      const g = parse(pg)
      if (formatted) {
        if (format(g) != formatted) console.log(JSON.stringify(g,null,2))
        assert.equal(format(g), formatted)
      }
      if (graph) {
        assert.deepEqual(buildGraph(g), graph)
      }
    })
  })
})

const invalid = JSON.parse(suiteFile('pg-format-invalid.json'))
describe("detect errors in invalid test cases", () => {
  for (let pg in invalid) {
    it(invalid[pg], () => assert.throws(() => parse(pg)))
  }
})

