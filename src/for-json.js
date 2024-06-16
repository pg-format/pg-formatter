function mergeProperties(properties={}, props) {
  for (let [key, values] of Object.entries(props)) {
    if (values.length) {
      if (key in properties) {
        properties[key].push(...values)
      } else {
        properties[key] = values
      }
    }
  }
  return properties
}

export function buildGraph(lines) {
  const nodes = {}, edges = []
  for (let line of lines) {
    if (line.node) {
      const node = getNodeObj(line.node);
      if (node.id in nodes) { // merge node information
        const labels = [...nodes[node.id].labels, ...node.labels]
        nodes[node.id].labels = Array.from(new Set(labels))
        mergeProperties(nodes[node.id].properties, node.properties)
      } else {
        nodes[node.id] = node;
      }
    } else if (line.edge) {
      const edge = getEdgeObj(line.edge)
      for (let id of [edge.from,edge.to]) {
        if (!(id in nodes)) {
          nodes[id] = { id, labels: [], properties: {} }
        }
      }
      edges.push(edge)
    }
  }
  return {
    nodes: Object.keys(nodes).sort().map(id => nodes[id]),
    edges
  }
}

export function formatJSONL(line) {
  let obj;
  if (line.node) {
    obj = { type: "node", ...getNodeObj(line.node) };
  } else if (line.edge) {
    obj = { type: "edge", ...getEdgeObj(line.edge) };
  }
  return JSON.stringify(obj)
}

function getNodeObj(node) {
  return {
    id: getLiteral(node.id),
    labels: [...(new Set(node.labels.map(getLiteral)))],
    properties: getPropertiesObj(node.properties),
  };
}

function getEdgeObj(edge) {
  let obj = {
    from: getLiteral(edge.from),
    to: getLiteral(edge.to),
    labels: edge.labels.map(getLiteral),
    properties: getPropertiesObj(edge.properties),
  };
  if (edge.direction === '--') obj.undirected = true
  if (edge.id) {
    return {
      id: getLiteral(edge.id),
      ...obj,
    };
  } else {
    return obj;
  }
}

function getPropertiesObj(properties) {
  let obj = {};
  properties.forEach((property) => {
    const key = getLiteral(property.key);
    const values = property.values.map(getLiteral);
    if (obj.hasOwnProperty(key)) {
      obj[key] = obj[key].concat(values);
    } else {
      obj[key] = values;
    }
  });
  return obj;
}

function getLiteral(elem) {
  return elem.literal;
}
