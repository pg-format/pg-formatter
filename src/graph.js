exports.formatJSONL = formatJSONL
exports.buildGraph = buildGraph

function mergeProperties(properties={}, props) {
  for (let [key, values] of props) {
    if (key in properties) {
      for (let val of values) {
        properties[key].add(val)
      }
    } else {
      properties[key] = new Set(values)
    }
  }
  for (let key in properties) {
    properties[key] = [...properties[key].values()]
  }
  return proper
}

function buildGraph(lines) {
  const nodes = {}, edges = []
  for (let line of lines) {
    if (line.node) {
      const node = getNodeObj(line.node);
      if (node.id in nodes) { // merge node information
        const labels = [...nodes[id].labels, ...node.labels]
        nodes[id].labels = Array.from(new Set(labels))
        mergeProperties(nodes[id].properties, node.properties)
      } else {
        nodes[node.id] = node;
      }
    } else if (line.edge) {
        edges.push(getEdgeObj(line.edge));
    }
  }
  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges
  }
}

function formatJSONL(line) {
  if (line.node) {
    return JSON.stringify(getNodeObj(line.node));
  } else if (line.edge) {
    return JSON.stringify(getEdgeObj(line.edge));
  }
}

function getNodeObj(node) {
  const properties = Object.fromEntries(
    node.properties.map(({key, values}) => [getLiteral(key), values.map(getLiteral)]))
  return {
    id: getLiteral(node.id),
    labels: node.labels.map(getLiteral),
    properties,
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
