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

exports.format = formatGraph;

function formatGraph({ lines, comments }, delim, sep) {
  formatted = [];
  let declaredNodes = {};
  let connectedNodes = {};
  lines.forEach((line) => {
    if (line.node) {
      declaredNodes[line.node.id.literal] = true;
      formatNode(line.node, delim);
    } else if (line.edge) {
      connectedNodes[line.edge.from.literal] = true;
      connectedNodes[line.edge.to.literal] = true;
      formatEdge(line.edge, delim);
    }
  });
  Object.keys(connectedNodes).forEach((id) => {
    if (!declaredNodes[id]) {
      formatted.push(`${id}`);
    }
  });
  return formatted.join(sep + '\n');
}

function formatNode({ id, labels, properties }, delim) {
  formatted.push([formatElement(id), ...labels.map(formatLabel), ...properties.map(formatProperty)].join(delim));
}

function formatEdge({ from, to, direction, labels, properties }, delim) {
  formatted.push([`${formatElement(from)} ${direction} ${formatElement(to)}`, ...labels.map(formatLabel), ...properties.map(formatProperty)].join(delim));
}

function formatLabel(label) {
  return `:${formatElement(label)}`;
}

function formatProperty({ key, values }) {
  return values.map(v => `${formatElement(key)}:${formatElement(v)}`).join(' ');
}

function formatElement(value) {
  if (value.hasOwnProperty('quote')) {
    return value.quote + value.literal + value.quote;
  } else {
    return value.literal;
  }
}
