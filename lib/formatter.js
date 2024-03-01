/**
 * Formatted serialization of PG given in parsed form.
 *
 * Parsed form differs from PG-JSON to preserve some formatting:
 *
 * - properties are Array instead of Object
 * - edges have an additional key 'direction'
 * - node ids, labels, property keys and values are Objects
 *   with information about original formatting
 *
 * Formatting can be configured with
 * - delimiter between elements (expect between the first three
 *   elements of an edge, these are always separated with space)
 * - separator between lines
 */

let formatted;
let commentsArr;

exports.format = formatGraph;

function formatGraph({ lines, comments }, delim, sep) {
  formatted = [];
  commentsArr = Object.entries(comments).map(([pos, text]) => ({
    pos: parseInt(pos),
    text: text,
  }));
  lines.forEach((line) => {
    if (line.node) {
      formatNode(line.node, delim);
    } else if (line.edge) {
      formatEdge(line.edge, delim);
    }
  });
  while (commentsArr.length) {
    formatted.push(commentsArr.shift().text);
  }
  return formatted.join(sep + '\n');
}

function formatNode({ id, labels, properties, pos }, delim) {
  while (commentsArr.length && commentsArr[0].pos < pos.start) {
    formatted.push(commentsArr.shift().text);
  }
  formatted.push([formatElement(id), ...labels.map(formatLabel), ...properties.map(formatProperty)].join(delim));
  while (commentsArr.length && commentsArr[0].pos < pos.end) {
    formatted[formatted.length - 1] += commentsArr.shift().text;
  }
}

function formatEdge({ from, to, direction, labels, properties, pos }, delim) {
  while (commentsArr.length && commentsArr[0].pos < pos.start) {
    formatted.push(commentsArr.shift().text);
  }
  formatted.push([`${formatElement(from)} ${direction} ${formatElement(to)}`, ...labels.map(formatLabel), ...properties.map(formatProperty)].join(delim));
  while (commentsArr.length && commentsArr[0].pos < pos.end) {
    formatted[formatted.length - 1] += commentsArr.shift().text;
  }
}

function formatLabel(label) {
  return `:${formatElement(label)}`;
}

function formatProperty({ key, values }) {
  return `${formatElement(key)}:${formatValueList(values)}`;
}

function formatElement(value) {
  return value.quote + value.literal + value.quote;
}

function formatValueList(values) {
  return values.map(formatElement).join(',');
}
