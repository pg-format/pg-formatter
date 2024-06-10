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

export function buildGraph(lines) {
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

export function formatJSONL(line) {
  let obj;
  if (line.node) {
    obj = { type: "node", ...getNodeObj(line.node) };
  } else if (line.edge) {
    obj = { type: "edge", ...getEdgeObj(line.edge) };
  }
  return JSON.stringify(obj, null, 2)
    .replace(/{\n */g, '{').replace(/\n *}/g, '}')
    .replace(/\[\n */g, '[').replace(/\n *\]/g, ']')
    .replace(/\n */g, ' ');
}

function getNodeObj(node) {
  return {
    id: getLiteral(node.id),
    labels: node.labels.map(getLiteral),
    properties: getPropertiesObj(node.properties),
  };
}

function getEdgeObj(edge) {
  let obj = {
    from: getLiteral(edge.from),
    to: getLiteral(edge.to),
    undirected: edge.direction === '--',
    labels: edge.labels.map(getLiteral),
    properties: getPropertiesObj(edge.properties),
  };
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
