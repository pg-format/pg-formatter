const q = document.querySelector.bind(document);
const editor = CodeMirror.fromTextArea(q('#input-text'), {
    mode: "pg",
    lineNumbers: true,
    viewportMargin: Infinity,
    lineWrapping: true,
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
});

var node = document.createElement("div")
node.setAttribute("style", "padding-left: 45px; padding-top: 2px;");
let bottomPanel = node.appendChild(document.createElement("div"));
bottomPanel.textContent = "\xA0"
editor.addPanel(node,{position:"bottom",stable:true})

function showError(message) {
  bottomPanel.textContent = message
  bottomPanel.setAttribute("style", "color: red;")
}

function showStatus(message) {
  bottomPanel.textContent = message
  bottomPanel.setAttribute("style", "color: green;")
}

CodeMirror.registerHelper('lint', 'pg', text => {
  try {
    // TODO: use this instead of onChange?
    pgParse(text) // TODO: we could save parsing result to avoid parsing twice
  } catch ({ message, location }) {
    /*
    message = message.replace(/ but .* found.$/, '');
    message = message.replace('[ \\t]', '');
    message = message.replace('[\\n]', '');
    message = message.replace('[\\r]', '');
    message = message.replace(/"(\S+)"/g, '$1');
    message = message.replace(/\\"/g, '"');
    message = message.replace('or ', ', ');
    message = message.replace(/(, )+/g, '<br>');
    */
    showError(message)
    const e = { message }
    if (location) {
      e.from = { line: location.start.line-1, ch: location.start.column-1 }
      e.to = { line: location.end.line-1, ch: location.end.column-1 }
    }
    return [e]
  }
  return []
})

const outputArea = CodeMirror.fromTextArea(q('#formatted-text'), {
    lineNumbers: true,
    viewportMargin: Infinity,
    lineWrapping: false,
    readOnly: true
});
editor.setSize('100%', '100%');
outputArea.setSize('100%', '100%');

let blitzboard = new Blitzboard(document.getElementById('child-area'));

let byProgram = false;
let timerId;
let parsedGraph = null;

function reformat(event, ui) {
  const input = editor.getValue();
  const outputStyle = q('#output-style').value;
  try {
    parsedGraph = pgParse(input)

    const nodeCount = parsedGraph.statements.filter(s => s.type === "node").length
    const edgeCount = parsedGraph.statements.filter(s => s.type === "edge").length
    showStatus(`Parsed ${nodeCount} node statements and ${edgeCount} edge statements.`)

    const output = pgFormat(parsedGraph, outputStyle);
    outputArea.setValue(output);
    if (outputStyle === 'jsonl' || outputStyle === 'json' || outputStyle === 'parsed') {
      outputArea.setOption('mode', 'javascript');
    } else {
      outputArea.setOption('mode', 'pg');
    }
    try {
      blitzboard.setGraph(pgForBlitz(parsedGraph), false);
      blitzboard.setConfig(Function('blitzboard', `"use strict";return ({edge:{caption:[]}})`)(blitzboard), true);
      blitzboard.network.stabilize();
    } catch (err) {
      // TODO: this should not happen
      showError("Failed to display graph (sorry, will be fixed!)")
      console.log(err);
      blitzboard.setGraph("", false);
    }
  } catch (err) {
    // TODO: error is already be shown as result of linter so no need to emit it here?
    console.warn(err.message)
  }
}

function onChanged(delta) {
  if (!byProgram) {
    clearTimeout(timerId);
    timerId = setTimeout(reformat, 500);
  } else {
    byProgram = false;
  }
  // update permalink 
  const url = new URL(window.location);
  url.search = new URLSearchParams({ pg: editor.getDoc().getValue() });
  document.getElementById("permalink").href = url;
}

editor.on('change', onChanged);
editor.on('cursorActivity', editor => {
  // TODO: look up in graph
  // console.log(editor.getCursor())
})

q('#output-style').addEventListener('change', onChanged);

q('#query-select').addEventListener('change', (event) => {
  if (event.target.value === '') {
    editor.setValue('');
  } else {
    let url = `https://raw.githubusercontent.com/g2glab/pg-formatter/main/examples/${event.target.value}`;
    axios.get(url).then((response) => {
      editor.setValue(response.data);
    });
  }
});

q('#copy-button').addEventListener('click', () => {
  navigator.clipboard.writeText(outputArea.getValue());
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('pg')) {
  editor.getDoc().setValue(urlParams.get('pg'));
} else if (urlParams.has('url')) {
  axios.get(urlParams.get('url')).then(response => editor.setValue(response.data))
}

document.addEventListener('DOMContentLoaded', function (event) {
  let url = `https://api.github.com/repos/g2glab/pg-formatter/contents/examples`;
  axios.get(url).then((response) => {
    const selectNode = q('#query-select');
    selectNode.innerHTML = '';

    let firstOption = document.createElement('option');
    firstOption.innerText = '';
    selectNode.appendChild(firstOption);

    for (let object of response.data) {
      if (object.name.endsWith('.pg')) {
        let option = document.createElement('option');
        option.innerText = object.name;
        selectNode.appendChild(option);
      }
    }
  });

  const inputArea = document.getElementById("input-area");
  const formattedArea = document.getElementById("formatted-area");
  const resizeHandle = document.getElementById("resize-handle");
  let isResizing = false;
  resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isResizing = true;
  });
  document.addEventListener("mousemove", (e) => {
    if (isResizing) {
      const newInputWidth = e.clientX - inputArea.getBoundingClientRect().left;
      const newFormattedWidth = window.innerWidth - e.clientX;
      const newInputPercent = newInputWidth / window.innerWidth * 100;
      const newFormattedPercent = newFormattedWidth / window.innerWidth * 100;
      inputArea.style.width = `${newInputPercent}%`;
      formattedArea.style.width = `${newFormattedPercent}%`;
    }
  });
  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
});
