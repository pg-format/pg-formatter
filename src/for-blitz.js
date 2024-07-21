export const formatForBlitz = ({nodes, edges}) => [
    ...nodes.map(formatNode),
    ...edges.map(formatEdge),
  ].join('\n')

const formatNode = ({ id, labels, properties }) =>
  [formatElement(id), ...labels.map(formatLabel), ...formatProperties(properties)].join(' ')

const formatEdge = ({ from, to, undirected, labels, properties }) =>
    [`${formatElement(from)} ${undirected ? '--' : '->'} ${formatElement(to)}`, ...labels.map(formatLabel), ...formatProperties(properties)].join(' ')

const formatLabel = label => `:${formatElement(label)}`

const formatProperties = properties =>
  Object.entries(properties).map(([key,values]) => 
      formatElement(key)+':'+values.map(formatValue).join(','))

// just quote everything
const formatElement = s => JSON.stringify(s)
const formatValue = s => typeof s === "string" ? JSON.stringify(s) : s

