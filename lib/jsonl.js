exports.format = formatJSONL;

function formatJSONL(line) {
  if (line.node) {
    return JSON.stringify(getNodeObj(line.node));
  } else if (line.edge) {
    return JSON.stringify(getEdgeObj(line.edge));
  }
}

function getNodeObj(node) {
  return {
    id: getLiteral(node.id),
    labels: node.labels.map(getLiteral),
    properties: node.properties.map(property => ({
      [getLiteral(property.key)]: property.values.map(getLiteral)
    }))
  };
}

function getEdgeObj(edge) {
  return {
    from: getLiteral(edge.from),
    to: getLiteral(edge.to),
    undirected: edge.direction === '--',
    labels: edge.labels.map(getLiteral),
    properties: edge.properties.map(property => ({
      [getLiteral(property.key)]: property.values.map(getLiteral)
    }))
  };
}

function getLiteral(elem) {
  return elem.literal;
}
