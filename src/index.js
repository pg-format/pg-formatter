const parser = require('./parser');
const formatter = require('./formatter.js');
const forBlitz = require('./for-blitz.js');

pgFormat = (input, delim = '\n  ', sep = '\n') => {
  return formatter.format(parser.parse(input), delim, sep);
};

pgForBlitz = (input, delim = ' ', sep = '') => {
  return forBlitz.format(parser.parse(input), delim, sep);
};
