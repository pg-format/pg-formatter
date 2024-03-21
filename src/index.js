const parser = require('./parser');
const formatter = require('./formatter.js');
const forBlitz = require('./for-blitz.js');
const json = require('./for-json.js');

pgFormat = (input, delim, sep) => {
  if (delim) {
    return formatter.format(parser.parse(input), delim, sep);
  } else {
    return parser.parse(input).lines.map(json.formatJSONL).join('\n');
  }
};

pgForBlitz = (input, delim = ' ', sep = '') => {
  return forBlitz.format(parser.parse(input), delim, sep);
};
