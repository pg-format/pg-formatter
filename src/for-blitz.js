let formatted;

export function formatForBlitz({ lines, comments }, delim=' ') {
  formatted = [];
  const nodes = {};
  const connectedNodes = new Set();
  lines.forEach((line) => {
    if (line.node) {
      const id = line.node.id.literal;
      if (nodes[id]) {
        nodes[id].labels = Array.from(new Set([...nodes[id].labels, ...line.node.labels]))
        nodes[id].properties = [...nodes[id].properties, ...line.node.properties];
      } else {
        nodes[id] = line.node;
      }
    } else if (line.edge) {
      connectedNodes.add(line.edge.from);
      connectedNodes.add(line.edge.to);
      formatEdge(line.edge, delim);
    }
  });
  Object.keys(nodes).forEach((id) => {
      formatNode(nodes[id], delim);
  });
  // Add implicit nodes
  Array.from(connectedNodes).forEach((id) => {
    if (!nodes[id.literal]) {
      formatted.push(`${formatElement(id)}`);
    }
  });
  return formatted.join('\n');
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
