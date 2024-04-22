let byProgram = false;
let timerId;

function reformat(event, ui) {
  const input = editor.getValue();
  const outputStyle = q('#indent-depth').value;
  let delim;
  let sep;
  if (outputStyle === 'space') {
    delim = ' ';
    sep = '';
    outputArea.setOption('mode', 'pgMode');
  } else if (outputStyle === 'jsonl') {
    outputArea.setOption('mode', 'application/json');
  } else {
    delim = '\n  ';
    sep = '\n';
    outputArea.setOption('mode', 'pgMode');
  }
  blitzboard.setGraph('', false);
  try {
    toastr.clear();
    outputArea.setValue(pgFormat(input, delim, sep) + '\n');
  } catch (err) {
    toastr.remove();
    outputArea.setValue(input);
    let title = 'SyntaxError';
    if (err.location) {
      const startLine = err.location.start.line;
      const endLine = err.location.end.line;
      const startCol = err.location.start.column;
      const endCol = err.location.end.column;
      if (startLine == endLine) {
        title += ` at line:${startLine}(col:${startCol}-${endCol})\n`;
      } else {
        title += ` at line:${startLine}(col:${startCol})-${endLine}(col:${endCol})\n`;
      }
      outputArea.setSelection({line: startLine-1, ch: startCol-1}, {line: endLine-1, ch: endCol-1});
    }
    toastr.options = {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      preventDuplicates: true
    }
    let message = '';
    if (err.message) {
      message = err.message;
      message = message.replace(/ but .* found.$/, '');
      message = message.replace('end of input', '');
      message = message.replace('[ \\t]', '');
      message = message.replace('[\\n]', '');
      message = message.replace('[\\r]', '');
      message = message.replace(/"(\S+)"/g, '$1');
      message = message.replace(/\\"/g, '"');
      message = message.replace('or ', ', ');
      message = message.replace(/(, )+/g, '<br>');
    }
    toastr.error(message, title);
  }
  try {
    blitzboard.setGraph(pgForBlitz(input), false);
    blitzboard.setConfig(Function('blitzboard', `"use strict";return ({edge:{caption:[]}})`)(blitzboard), true);
    blitzboard.network.stabilize();
  } catch (err) {
    console.log(err);
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

q('#indent-depth').addEventListener('change', onChanged);

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
