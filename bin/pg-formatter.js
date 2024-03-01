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
      outputJsonLines(objectTree, outFilePrefix);
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

function outputJSON(objectTree) {
  // print selected properties for JSON-PG
  const basicProps = ['nodes', 'edges', 'id', 'from', 'to', 'direction', 'labels', 'properties'];

  const nodeProps = Object.keys(objectTree.nodeProperties);
  const edgeProps = Object.keys(objectTree.edgeProperties);
  
  console.log(JSON.stringify(objectTree, basicProps.concat(nodeProps).concat(edgeProps), 2));
}

function outputPGX(objectTree, outFilePrefix) {

  const nodeFile = outFilePrefix + '.pgx.nodes';
  const edgeFile = outFilePrefix + '.pgx.edges';

  const nodeProps = Object.keys(objectTree.nodeProperties);
  const edgeProps = Object.keys(objectTree.edgeProperties);

  let i = 1;
  objectTree.edges.forEach(e => {
    console.log(i + ' ' + e.from + ' ' + e.to);
    i++;
  });

  // Output nodes
  let nodeLines = [];

  // fs.writeFile(nodeFile, nodeLines.join('\n') + '\n', (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(`"${nodeFile}" has been created.`);
  //   }
  // });
}

function outputNeo(objectTree, outFilePrefix) {

  const nodeFile = outFilePrefix + '.neo.nodes';
  const edgeFile = outFilePrefix + '.neo.edges';

  const nodeProps = Object.keys(objectTree.nodeProperties);
  const edgeProps = Object.keys(objectTree.edgeProperties);

  // Output nodes
  let nodeHeader = ['id:ID', ':LABEL'];
  nodeHeader = nodeHeader.concat(nodeProps);

  let nodeLines = [];

  nodeLines.push(nodeHeader.join('\t'));

  objectTree.nodes.forEach(n => {
    let line = [];
    line.push(n.id)
    line.push(n.labels)
    nodeProps.forEach(p => {
      if (n.properties[p]) {
        line.push(n.properties[p].join(';'));
      } else {
        line.push('');
      }
    });
    nodeLines.push(line.join('\t'));
  });

  fs.writeFile(nodeFile, nodeLines.join('\n') + '\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`"${nodeFile}" has been created.`);
    }
  });

  // Output edges
  let edgeHeader = [':START_ID', ':END_ID', ':TYPE'];
  edgeHeader = edgeHeader.concat(edgeProps);

  let edgeLines = [];
  edgeLines.push(edgeHeader.join('\t'));

  objectTree.edges.forEach(e => {
    let line = [];
    line.push(e.from, e.to)
    line.push(e.labels)
    edgeProps.forEach(p => {
      if (e.properties[p]) {
        line.push(e.properties[p].join(';'));
      } else {
        line.push('');
      }
    });
    edgeLines.push(line.join('\t'));
  });

  fs.writeFile(edgeFile, edgeLines.join('\n') + '\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`"${edgeFile}" has been created.`);
    }
  });
}

function outputJsonLines(objectTree, outFilePrefix) {

  const outFile = outFilePrefix + '.cyjs';

  const nodeProps = Object.keys(objectTree.nodeProperties);
  const edgeProps = Object.keys(objectTree.edgeProperties);
  objectTree.nodes.forEach(n => {
    let line = [];
    line.push(`"id": ${n.id},`);
    line.push('"labels": [ '+n.labels.join(',')+' ],');
    let props = [];
    nodeProps.forEach(p => {
      vals = n.properties[p];
      props.push(`${p}: [ ` + vals.join(', ') + ' ]');
    });
    line.push('"properties": { ' + props.join(', ') + ' }');
    console.log('{ "type": "node",', line.join(' '), '}');
  });
  objectTree.edges.forEach(e => {
    let line = [];
    line.push(`"from": ${e.from},`);
    line.push(`"to": ${e.to},`);
    if (e.direction === '->') {
      // line.push(`"direction": "${e.direction}",`)
    } else {
      line.push(`"undirected": true,`)
    }
    line.push('"labels": [ ' + e.labels.join(', ') + ' ],')
    let props = [];
    edgeProps.forEach(p => {
      vals = e.properties[p];
      props.push(`${p}: [ ` + vals.join(', ') + ' ]');
    });
    if (props.length) {
      line.push('"properties": { ' + props.join(', ') + ' }');
    } else {
      line.push('"properties": {}');
    }
    console.log('{ "type": "edge",', line.join(' '), '}');
  });
}

function outputCyJS(objectTree, outFilePrefix) {

  const outFile = outFilePrefix + '.cyjs';

  let counter = 0;
  let nodeCounter = 0;
  let edgeCounter = 0;
  let getNodeID = {};

  console.log('{');
  console.log('  "elements": {');
  console.log('    "nodes": [');

  // Output nodes
  let nodeLines = [];
  objectTree.nodes.forEach(n => {
    counter++;
    nodeCounter++;
    if (nodeCounter > 1) {
      console.log('      ,');
    }
    console.log('      {');
    console.log('        "data": {');
    Object.entries(n.properties).forEach(([p,vals]) => {
      vals.forEach(val => {
        console.log(`          "${p}": "${val}",`);
      });
    });
    n.labels.forEach(lab => {
      console.log(`          "label": "${lab}",`);
    });
    console.log(`          "id": "${n.id}"`);
    // console.log(`          "id_original": "${n.id}",`);
    // console.log(`          "id": "${counter}"`);
    console.log('        }');
    console.log('      }');
    getNodeID[n.id] = nodeCounter;
  });
  console.log('    ],');
  console.log('    "edges": [');

  // Output edges
  let edgeLines = [];
  objectTree.edges.forEach(e => {
    counter++;
    edgeCounter++;
    const source = getNodeID[e.from];
    const target = getNodeID[e.to];
    if (edgeCounter > 1) {
      console.log('      ,');
    }
    console.log('      {');
    console.log('        "data": {');
    Object.entries(e.properties).forEach(([p,vals]) => {
      vals.forEach(val => {
        console.log(`          "${p}": "${val}",`);
      });
    });
    e.labels.forEach(lab => {
      console.log(`          "label": "${lab}",`);
    });
    console.log(`          "source": "${e.from}",`);
    console.log(`          "target": "${e.to}",`);
    const edgeID = `EdgeID_${edgeCounter}`;
    if (getNodeID[edgeID]) {
      console.error(`ERROR: edge ID ${edgeID} already used as a node ID`);
    }
    console.log(`          "id": "${edgeID}"`);
    // console.log(`          "source": "${source}",`);
    // console.log(`          "target": "${target}",`);
    // console.log(`          "id": "${counter}"`);
    console.log('        }');
    console.log('      }');
  });
  console.log('    ]');
  console.log('  }');
  console.log('}');

  // fs.writeFile(outFile, nodeLines.join('\n') + '\n' + edgeLines.join('\n') + '\n', (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(`"${outFile}" has been created.`);
  //   }
  // });
}

function outputCyJSON(objectTree, outFilePrefix) {

  let counter = 0;
  let nodeCounter = 0;
  let edgeCounter = 0;
  let getNodeID = {};

  console.log('  {');
  console.log('    "nodes": [');

  // Output nodes
  let nodeLines = [];
  objectTree.nodes.forEach(n => {
    counter++;
    nodeCounter++;
    if (nodeCounter > 1) {
      console.log('      ,');
    }
    console.log('      {');
    console.log('        "data": {');
    Object.entries(n.properties).forEach(([p,vals]) => {
      vals.forEach(val => {
        console.log(`          "${p}": "${val}",`);
      });
    });
    n.labels.forEach(lab => {
      console.log(`          "label": "${lab}",`);
    });
    console.log(`          "id": "${n.id}"`);
    console.log('        }');
    console.log('      }');
    getNodeID[n.id] = nodeCounter;
  });
  console.log('    ],');
  console.log('    "edges": [');

  // Output edges
  let edgeLines = [];
  objectTree.edges.forEach(e => {
    counter++;
    edgeCounter++;
    if (edgeCounter > 1) {
      console.log('      ,');
    }
    console.log('      {');
    console.log('        "data": {');
    Object.entries(e.properties).forEach(([p,vals]) => {
      vals.forEach(val => {
        console.log(`          "${p}": "${val}",`);
      });
    });
    e.labels.forEach(lab => {
      console.log(`          "label": "${lab}",`);
    });
    console.log(`          "source": "${e.from}",`);
    console.log(`          "target": "${e.to}",`);
    const edgeID = `EdgeID_${edgeCounter}`;
    if (getNodeID[edgeID]) {
      console.error(`ERROR: edge ID ${edgeID} already used as a node ID`);
    }
    console.log(`          "id": "${edgeID}"`);
    console.log('        }');
    console.log('      }');
  });
  console.log('    ]');
  console.log('  }');
}

function checkGraph(objectTree) {
  // Check validity of graph
  let edgeExistFor = {};
  objectTree.edges.forEach((e) => {
    edgeExistFor[e.from] = true;
    edgeExistFor[e.to] = true;
  });

  let nodeExist = {};
  objectTree.nodes.forEach(n => {
    nodeExist[n.id] = true;
  });

  Object.keys(edgeExistFor).forEach((n) => {
    if (! nodeExist[n]) {
      console.error('missing node:\t' + n);
    }
  });

  Object.keys(nodeExist).forEach((n) => {
    if (! edgeExistFor[n]) {
      console.error('orphan node:\t' + n);
    }
  });
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
