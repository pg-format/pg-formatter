let formatted;

exports.format = formatGraph;

function formatGraph({ lines, comments }, delim, sep) {
  formatted = [];
  const declaredNodes = new Set();
  const connectedNodes = new Set();
  lines.forEach((line) => {
    if (line.node) {
      declaredNodes.add(line.node.id.literal);
      formatNode(line.node, delim);
    } else if (line.edge) {
      connectedNodes.add(line.edge.from);
      connectedNodes.add(line.edge.to);
      formatEdge(line.edge, delim);
    }
  });
  Array.from(connectedNodes).forEach((id) => {
    if (!declaredNodes.has(id.literal)) {
      formatted.push(`${formatElement(id)}`);
    }
  });
  return formatted.join(sep + '\n');
}

function formatNode({ id, labels, properties }, delim) {
  formatted.push([formatElement(id), ...labels.map(formatLabel), ...formatProperty(properties)].join(delim));
}

function formatEdge({ from, to, direction, labels, properties }, delim) {
  formatted.push([`${formatElement(from)} ${direction} ${formatElement(to)}`, ...labels.map(formatLabel), ...formatProperty(properties)].join(delim));
}

function formatLabel(label) {
  return `:${formatElement(label)}`;
}

function formatProperty(properties) {
  let obj = {};
  properties.forEach((property) => {
    const key = formatElement(property.key);
    const values = property.values.map(value => value.literal);
    if (obj.hasOwnProperty(key)) {
      obj[key] = obj[key].concat(values);
    } else {
      obj[key] = values;
    }
  });
  return Object.entries(obj).map(([key, values]) => {
    return `${key}:"${values.join(",")}"`;
  });
}

function formatElement(value) {
  if (value.quote) {
    return value.quote + value.literal + value.quote;
  } else {
    return '"' + value.literal + '"';
  }
}
