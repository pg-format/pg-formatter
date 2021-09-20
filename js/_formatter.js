pgFormat = (input) => {
  const parser = require('../lib/parser');
  const formatter = require('../lib/formatter.js');
  return formatter.format(parser.parse(input), '\n  ');
};
