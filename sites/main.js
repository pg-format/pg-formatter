const q = document.querySelector.bind(document);
let byProgram = false, editor, outputArea;
let timerId;

function reformat(event, ui) {
  try {
    const input = editor.getValue();
    if (input) {
      outputArea.setValue(pgFormat(input) + '\n');
    } else {
      outputArea.setValue('');
    }
  } catch (e) {
    console.log(e);
    toastr.error('', 'SyntaxError', { preventDuplicates: true });
  }
}

function onChanged(delta) {
  if (!byProgram) {
    clearTimeout(timerId);
    timerId = setTimeout(reformat, 500);
  } else {
    byProgram = false;
  }
}

editor = CodeMirror.fromTextArea(q('#input-text'), {
  lineNumbers: true,
  viewportMargin: Infinity,
  lineWrapping: true
});

outputArea = CodeMirror.fromTextArea(q('#formatted-text'), {
  lineNumbers: true,
  viewportMargin: Infinity,
  lineWrapping: true,
  readOnly: true
});

editor.setSize('100%', '100%');

outputArea.setSize('100%', '100%');

editor.on('change', onChanged);

q('#indent-depth').addEventListener('change', onChanged);

q('#query-select').addEventListener('change', (event) => {
  if (event.target.value === '') {
    editor.setValue('');
  } else {
    let url = `https://raw.githubusercontent.com/hchiba1/pg-formatter/main/examples/${event.target.value}`;
    axios.get(url).then((response) => {
      editor.setValue(response.data);
    });
  }
});

q('#copy-button').addEventListener('click', () => {
  navigator.clipboard.writeText(outputArea.getValue());
});

document.addEventListener('DOMContentLoaded', function (event) {
  let url = `https://api.github.com/repos/hchiba1/pg-formatter/contents/examples`;
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
