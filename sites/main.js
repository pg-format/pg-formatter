let byProgram = false;
let timerId;

function reformat(event, ui) {
  const input = editor.getValue();
  let delim = '\n  ';
  let sep = '\n';
  if (q('#indent-depth').value === 'space') {
    delim = ' ';
    sep = '';
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
    }
    toastr.error(message, title);
  }
  blitzboard.setGraph(input, false);
  blitzboard.setConfig(Function('blitzboard', `"use strict";return ({edge:{caption:[]}})`)(blitzboard), true);
  blitzboard.network.stabilize();
}

function onChanged(delta) {
  if (!byProgram) {
    clearTimeout(timerId);
    timerId = setTimeout(reformat, 500);
  } else {
    byProgram = false;
  }
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
});
