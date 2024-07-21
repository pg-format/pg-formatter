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
 * - separator between statements
 */

let formatted;
let commentsArr;

export function format({ statements, comments }, delim=' ', sep='') {
  formatted = [];
  commentsArr = Object.entries(comments).map(([pos, text]) => ({
    pos: parseInt(pos),
    text: text,
  }));
  statements.forEach(stm => {
    if (stm.type === "node") {
      formatNode(stm, stm.pos, delim);
    } else if (stm.type === "edge") {
      formatEdge(stm, stm.pos, delim);
    }
  });
  while (commentsArr.length) {
    formatted.push(commentsArr.shift().text);
  }
  return formatted.join(sep + '\n');
}

function formatNode({ id, labels, properties }, pos, delim) {
  while (commentsArr.length && commentsArr[0].pos < pos.start) {
    formatted.push(commentsArr.shift().text);
  }
  formatted.push([formatElement(id), ...labels.map(formatLabel), ...properties.map(formatProperty)].join(delim));
  while (commentsArr.length && commentsArr[0].pos < pos.end) {
    formatted[formatted.length - 1] += commentsArr.shift().text;
  }
}

function formatEdge({ id, from, to, direction, labels, properties }, pos, delim) {
  while (commentsArr.length && commentsArr[0].pos < pos.start) {
    formatted.push(commentsArr.shift().text);
  }
  let edge = '';
  if (id) {
    edge += `${formatElement(id)}: `;
  }
  edge += `${formatElement(from)} ${direction} ${formatElement(to)}`;
  formatted.push([edge, ...labels.map(formatLabel), ...properties.map(formatProperty)].join(delim));
  while (commentsArr.length && commentsArr[0].pos < pos.end) {
    formatted[formatted.length - 1] += commentsArr.shift().text;
  }
}

function formatLabel(label) {
  return `:${formatElement(label)}`;
}

function formatProperty({ key, values }) {
  return (key.literal === key.value && key.value.match(/:/)) // unquoted key with colon
    ? `${key.literal}: ${formatValueList(values)}`
    : `${formatElement(key)}:${formatValueList(values)}`;
}

function formatElement(value) {
  if (typeof value.value === "number") return value.value
  return value.literal ?? value.value
}

function formatValueList(values) {
  return values.map(formatElement).join(',');
}
