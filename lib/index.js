const parser = require('../lib/parser');
const formatter = require('../lib/formatter.js');

pgFormat = (input, delim = '\n  ', sep = '\n') => {
  return formatter.format(parser.parse(input), delim, sep);
};

module.exports = pgFormat;
