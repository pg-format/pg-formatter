#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const path = require('path');
const parser = require('../lib/parser.js');
const formatter = require('../lib/formatter.js');
const version = require('../package.json').version;

const opts = program
  .option('-f, --format <FORMAT>', 'jsonl')
  .option('-d, --debug', 'output parsed synatax tree')
  .version(version)
  .arguments('[PG_FILE]')
  .parse(process.argv)
  .opts();

if (program.args.length < 1 && process.stdin.isTTY) {
  program.help();
}

(async () => {
  let inputText;
  if (program.args[0]) {
    inputText = await fs.readFile(program.args[0], 'utf8').toString();
  } else {
    inputText = await readStdin();
  }

  let parsedObj;
  try {
    parsedObj = new parser.parse(inputText);
  } catch (err) {
    printError(inputText, err);
    process.exit(1);
  }

  if (opts.debug) {
    console.log(JSON.stringify(parsedObj, null, 2));
  } else if (opts.format) {
    switch (opts.format) {
      case 'jsonl':
        parsedObj.lines.forEach(line => {
          if (line.node) {
            console.log(JSON.stringify(getNodeObj(line.node)));
          } else if (line.edge) {
            console.log(JSON.stringify(getEdgeObj(line.edge)));
          }
        });
        break;
      default:
        console.error(`${opts.format}: unknown output format`);
        break;
    }
  } else {
    console.log(formatter.format(parsedObj, ' ', ''));
  }
})();

function readStdin() {
  let buf = '';
  return new Promise(resolve => {
    process.stdin.on('readable', () => {
      let chunk;
      while (chunk = process.stdin.read()) {
        buf += chunk;
      }
    });
    process.stdin.on('end', () => resolve(buf));
  });
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

function printError(inputText, err) {
  const startLine = err.location.start.line;
  const endLine = err.location.end.line;
  const startCol = err.location.start.column;
  const endCol = err.location.end.column;
  if (startLine == endLine) {
    console.error(`Error at line:${startLine}(col:${startCol}-${endCol})`);
  } else {
    console.error(`Error at line:${startLine}(col:${startCol})-${endLine}(col:${endCol})`);
  }
  let message = '';
  if (err.message) {
    message = err.message;
    message = message.replace(/^Expected/, 'Expected:');
    message = message.replace(/ but .* found.$/, '');
    message = message.replace('[ \\t]', '');
    message = message.replace('[\\r\\n]', '');
    message = message.replace('or ', ', ');
    message = message.replace(/ *(, )+/g, ' ');
  }
  console.error(message);
  console.error('--');
  const lines = inputText.split('\n').slice(startLine - 1, endLine);
  lines.forEach((line, i) => {
    if (i == 0) {
      console.error(line.substring(0, startCol - 1) + makeRed(line.substring(startCol - 1)));
    } else if (i < lines.length - 1) {
      console.error(makeRed(line));
    } else {
      console.error(makeRed(line.substring(0, endCol)) + line.substring(endCol));
    }
  });
}

function makeRed(text) {
  const red = '\u001b[41m';
  const reset = '\u001b[0m';
  return red + text + reset;
}
