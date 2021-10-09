pgFormat = (input, delim = '\n  ', sep = '\n') => {
  const parser = require('../lib/parser-v2');
  const formatter = require('../lib/formatter.js');
  return formatter.format(parser.parse(input), delim, sep);
};
