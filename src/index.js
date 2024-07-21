import { parse } from './parser.js';
import { format } from './formatter.js';
import { formatForBlitz } from './for-blitz.js';
import { buildGraph, formatJSONL } from './for-json.js';

export const pgFormat = (parsed, style) => {
  switch (style) {
    case 'space': 
      return format(parsed, ' ', '')
    case 'lines':
      return format(parsed, '\n  ', '\n')
    case 'jsonl':
      return parsed.statements.map(formatJSONL).join('\n')
    case 'json':
      return JSON.stringify(buildGraph(parsed),null,2)
    case 'blitz':
      return formatForBlitz(buildGraph(parsed))
    case 'parsed':
      return JSON.stringify(parsed,null,2)
  }
};

export const pgForBlitz = parsed => formatForBlitz(buildGraph(parsed))

if (typeof window !== 'undefined') {
  window.pgFormat = pgFormat;
  window.pgForBlitz = pgForBlitz;
  window.pgParse = parse;
}
