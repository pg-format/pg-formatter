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

export function buildGraph({ statements }) {
  const nodes = {}, edges = []
  for (let stm of statements) {
    if (stm.type === "node") {
      const node = getNodeObj(stm);
      if (node.id in nodes) { // merge node information
        const labels = [...nodes[node.id].labels, ...node.labels]
        nodes[node.id].labels = Array.from(new Set(labels))
        mergeProperties(nodes[node.id].properties, node.properties)
      } else {
        nodes[node.id] = node;
      }
    } else if (stm.type === "edge") {
      const edge = getEdgeObj(stm)
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

export function formatJSONL(statement) {
  let obj;
  if (statement.type === "node") {
    obj = { type: "node", ...getNodeObj(statement) };
  } else if (statement.type === "edge") {
    obj = { type: "edge", ...getEdgeObj(statement) };
  }
  return JSON.stringify(obj)
}

function getNodeObj(node) {
  return {
    id: getIdentifier(node.id),
    labels: [...(new Set(node.labels.map(getIdentifier)))],
    properties: getPropertiesObj(node.properties),
  };
}

function getEdgeObj(edge) {
  let obj = {
    from: getIdentifier(edge.from),
    to: getIdentifier(edge.to),
    labels: edge.labels.map(getIdentifier),
    properties: getPropertiesObj(edge.properties),
  };
  if (edge.direction === '--') obj.undirected = true
  if (edge.id) {
    return {
      id: getIdentifier(edge.id),
      ...obj,
    };
  } else {
    return obj;
  }
}

function getPropertiesObj(properties) {
  let obj = {};
  properties.forEach((property) => {
    const key = getIdentifier(property.key);
    const values = property.values.map(getIdentifier);
    if (obj.hasOwnProperty(key)) {
      obj[key] = obj[key].concat(values);
    } else {
      obj[key] = values;
    }
  });
  return obj;
}

function getIdentifier(elem) {
  return elem.value ?? elem.literal;
}
