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
