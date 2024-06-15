import { parse } from './parser.js';
import { format } from './formatter.js';
import { formatForBlitz } from './for-blitz.js';
import { buildGraph, formatJSONL } from './for-json.js';

export const pgFormat = (input, style) => {
  const parsed = typeof input === 'string' ? parse(input) : input
  switch (style) {
    case 'space': 
      return format(parsed, ' ', '')
    case 'lines':
      return format(parsed, '\n  ', '\n')
    case 'jsonl':
      return parsed.lines.map(formatJSONL).join('\n')
    case 'json':
      return JSON.stringify(buildGraph(parsed.lines),null,2)
  }
};

export const pgForBlitz = (input, delim = ' ', sep = '') => {
  return formatForBlitz(parse(input), delim, sep);
};

if (typeof window !== 'undefined') {
  window.pgFormat = pgFormat;
  window.pgForBlitz = pgForBlitz;
}
