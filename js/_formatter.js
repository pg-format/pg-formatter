pgFormat = (input, delim = '\n  ', sep = '\n') => {
  const parser = require('../lib/parser');
  const formatter = require('../lib/formatter.js');
  return formatter.format(parser.parse(input), delim, sep);
};
