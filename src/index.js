import { parse } from './parser.js';
import { format } from './formatter.js';
import { formatGraph as formatForBlitz } from './for-blitz.js';
import { formatJSONL } from './for-json.js';

export const pgFormat = (input, delim, sep) => {
  if (delim) {
    return format(parse(input), delim, sep);
  } else {
    return parse(input).lines.map(formatJSONL).join('\n');
  }
};

export const pgForBlitz = (input, delim = ' ', sep = '') => {
  return formatForBlitz(parse(input), delim, sep);
};

if (typeof window !== 'undefined') {
  window.pgFormat = pgFormat;
  window.pgForBlitz = pgForBlitz;
}
