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
  let out = quoteLiteral(node.id);
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
  let out = `${quoteLiteral(edge.from)} ${edge.direction} ${quoteLiteral(edge.to)}`;
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
  return labels.map(x => `:${quoteLiteral(x)}`).join(delim);
}

function getProps(props, delim) {
  let ret = [];
  for (const i in props) {
    ret.push(`${quoteLiteral(props[i].key)}: ${quoteLiteral(props[i].value)}`);
  }
  return ret.join(delim);
}

function quoteLiteral(value) {
  return value.quote + value.literal + value.quote;
}
