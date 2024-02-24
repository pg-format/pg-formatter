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

function formatGraph({ nodes, edges, comments }, delim, sep) {
  formatted = [];
  commentsArr = comments;
  nodes.map((node) => formatNode(node, delim));
  edges.map((edge) => formatEdge(edge, delim));
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

function formatProperty({ key, value }) {
  return `${formatElement(key)}: ${formatElement(value)}`;
}

function formatElement(value) {
  return value.quote + value.literal + value.quote;
}
