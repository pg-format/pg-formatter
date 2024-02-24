const parser = require('./parser');
const formatter = require('./formatter.js');

pgFormat = (input, delim = '\n  ', sep = '\n') => {
  return formatter.format(parser.parse(input), delim, sep);
};

module.exports = pgFormat;
