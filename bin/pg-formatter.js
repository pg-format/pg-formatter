#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const path = require('path');
const parser = require('../lib/parser.js');
const formatter = require('../lib/formatter.js');
const version = require('../package.json').version;

const opts = program
  .option('-f, --format <FORMAT>', 'json, jsonl, neo, cyjs, cyjson')
  .option('-o, --outdir <DIR>', 'output directory', './')
  .option('-c, --check', 'check for missing/orphan nodes')
  .option('-d, --debug', 'output parsed synatax tree')
  .version(version)
  .arguments('[PG_FILE]')
  .parse(process.argv)
  .opts();

// Get input and output file names
let inputText;

let outFilePrefix;
if(program.args[0]) {
  const inputFile = program.args[0];
  const basename = path.basename(inputFile, '.pg');
  inputText = fs.readFileSync(inputFile, "utf8").toString();
  outFilePrefix = path.join(opts.outdir, basename);
  if (!fs.existsSync(opts.outdir)) {
    fs.mkdirSync(opts.outdir, {recursive: true});
  }
} else if (process.stdin.isTTY) {
  program.help();
} else {
  inputText = fs.readFileSync(process.stdin.fd).toString();
  outFilePrefix = 'pgfmt';
}

// Parse PG file
let objectTree;
try {
  objectTree = new parser.parse(inputText);
} catch (err) {
  printError(err);
  process.exit(1);
}

// Output
if (opts.check) {
  checkGraph(objectTree);
} else if (opts.debug) {
  console.log(JSON.stringify(objectTree, null, 2));
} else if (opts.format) {
  switch (opts.format) {
    case 'json':
      outputJSON(objectTree);
      break;
    case 'jsonl':
      objectTree.lines.forEach(line => {
        if (line.node) {
          console.log(JSON.stringify(getNodeObj(line.node)));
        } else if (line.edge) {
          console.log(JSON.stringify(getEdgeObj(line.edge)));
        }
      });
      break;
    case 'neo':
      outputNeo(objectTree, outFilePrefix);
      break;
    case 'cyjs':
      outputCyJS(objectTree, outFilePrefix);
      break;
    case 'cyjson':
      outputCyJSON(objectTree, outFilePrefix);
      break;
    case 'pgx':
      outputPGX(objectTree, outFilePrefix);
      break;
    default:
      console.error(`${opts.format}: unknown output format`);
      break;
  }
} else {
  console.log(formatter.format(objectTree, ' ', ''));
}

function getNodeObj(node) {
  return {
    id: getElement(node.id),
    labels: node.labels.map(label => getElement(label)),
    properties: node.properties.map(property => {
      let obj = {};
      obj[getElement(property.key)] = property.values.map(v => getElement(v));
      return obj;
    })
  };
}

function getEdgeObj(edge) {
  return {
    from: getElement(edge.from),
    to: getElement(edge.to),
    undirected: edge.direction === '--',
    labels: edge.labels.map(label => getElement(label)),
    properties: edge.properties.map(property => {
      let obj = {};
      obj[getElement(property.key)] = property.values.map(v => getElement(v));
      return obj;
    })
  };
}

function getElement(elem) {
  return elem.quote + elem.literal + elem.quote;
}

function printError(err) {
  const startLine = err.location.start.line;
  const endLine = err.location.end.line;
  const startCol = err.location.start.column;
  const endCol = err.location.end.column;
  if (startLine == endLine) {
    console.error(`ERROR line:${startLine}(col:${startCol}-${endCol})`);
  } else {
    console.error(`ERROR line:${startLine}(col:${startCol})-${endLine}(col:${endCol})`);
  }
  console.error(err.message);
  console.error('--');
  const lines = inputText.split('\n').slice(startLine-1, endLine);
  lines.forEach((line, i) => {
    if (i == 0) {
      console.error(makeRed(line.substring(0, startCol - 1)) + line.substring(startCol - 1));
    } else if (i < lines.length - 1) {
      console.error(makeRed(line));
    } else {
      console.error(makeRed(line.substring(0, endCol)) + line.substring(endCol));
    }
  });
}

function makeRed(text) {
  // const red = '\u001b[31m'; // foreground
  const red = '\u001b[41m'; // backgrond
  const reset = '\u001b[0m';
  return red + text + reset;
}
