exports.format = (objectTree, delim, sep) => {
  const out1 = objectTree.nodes.map((node) => {
    return printNode(node, delim);
  });

  const out2 = objectTree.edges.map((edge) => {
    return printEdge(edge, delim);
  });

  sep += '\n';
  return out1.join(sep) + sep + out2.join(sep);
}

function printNode(node, delim) {
  let out = node.id;
  const labels = getLabels(node.labels, delim);
  props = getProps(node.properties, delim);
  if (labels) {
    out += `${delim}${labels}`;
  }
  if (props) {
    out += `${delim}${props}`;
  }
  return out;
}

function printEdge(edge, delim) {
  let out = `${edge.from} ${edge.direction} ${edge.to}`;
  let labels = getLabels(edge.labels, delim);
  props = getProps(edge.properties, delim);
  if (labels) {
    out += `${delim}${labels}`;
  }
  if (props) {
    out += `${delim}${props}`;
  }
  return out;
}

function getLabels(labels, delim) {
  return labels.map(x => `:${x}`).join(delim);
}

function getProps(props, delim) {
  let ret = [];
  Object.entries(props).forEach(([key, vals]) => {
    vals.forEach((val) => {
      ret.push(`${key}: ${val}`);
    });
  });
  return ret.join(delim);
}
