exports.format = (objectTree, sep) => {
  const out1 = objectTree.nodes.map((node) => {
    return printNode(node, sep);
  });

  const out2 = objectTree.edges.map((edge) => {
    return printEdge(edge, sep);
  });

  return out1.join('\n\n') + '\n\n' + out2.join('\n\n');
}

function printNode(node, sep) {
  let out = node.id;
  const labels = getLabels(node.labels, sep);
  props = getProps(node.properties, sep);
  if (labels) {
    out += `${sep}${labels}`;
  }
  if (props) {
    out += `${sep}${props}`;
  }
  return out;
}

function printEdge(edge, sep) {
  let out = `${edge.from} ${edge.direction} ${edge.to}`;
  let labels = getLabels(edge.labels, sep);
  props = getProps(edge.properties, sep);
  if (labels) {
    out += `${sep}${labels}`;
  }
  if (props) {
    out += `${sep}${props}`;
  }
  return out;
}

function getLabels(labels, sep) {
  return labels.map(x => `:${x}`).join(sep);
}

function getProps(props, sep) {
  let ret = [];
  Object.entries(props).forEach(([key, vals]) => {
    vals.forEach((val) => {
      ret.push(`${key}: ${val}`);
    });
  });
  return ret.join(sep);
}
