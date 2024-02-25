{
  let nodeCount = 0;
  let edgeCount = 0;
  let comments = {};
}

PG = lines:( NodeLine / EdgeLine )* EmptyLine*
{
  const commentsArr = Object.entries(comments).map(([pos, text]) => ({
    pos: parseInt(pos),
    text: text.trimEnd(),
  }));

  return {
    nodes: lines.map(l => l.node).filter(v => v),
    edges: lines.map(l => l.edge).filter(v => v),
    nodeCount: nodeCount,
    edgeCount: edgeCount,
    comments: commentsArr,
  }
}

NodeLine = EmptyLine* n:Node (TrailingComment / SPACE_OR_TAB*) EOL
{
  n.node.pos.end = location().end.offset;
  return n;
}

EdgeLine = EmptyLine* e:Edge (TrailingComment / SPACE_OR_TAB*) EOL
{
  e.edge.pos.end = location().end.offset;
  return e;
}

Node = id:Value l:Label* p:Property*
{
  nodeCount++;

  return {
    node: {
      id: id,
      labels: l,
      properties: p,
      pos: {
        start: location().start.offset,
      }
    }
  }
}

Edge = f:Value SPACE_OR_TAB+ d:Direction SPACE_OR_TAB+ t:Value l:Label* p:Property*
{
  edgeCount++;

  return {
    edge: {
      from: f,
      to: t,
      direction: d,
      labels: l,
      properties: p,
      pos: {
        start: location().start.offset,
      }
    }
  }
}

Label = Delimiter ':' SPACE_OR_TAB* l:Value
{
  return l
}

Property = Delimiter k:Value SPACE_OR_TAB* ':' SPACE_OR_TAB* v:Value
{
  return {
    key: k,
    value: v
  }
}

Direction = '--' / '->' / '<-'

Number = '-'? Integer ('.' [0-9]+)? Exp?

Integer = '0' / [1-9] [0-9]*

Exp = [eE] ('-' / '+')? [0-9]+

EscapedChar = "'"
/ '"'
/ "\\"
/ "b"
{
  return "\b";
}
/ "f"
{
  return "\f";
}
/ "n"
{
  return "\n";
}
/ "r"
{
  return "\r";
}
/ "t"
{
  return "\t";
}
/ "v"
{
  return "\x0B";
}

DoubleQuotedChar = !('"' / "\\") char:.
{
  return char;
}
/ "\\" esc:EscapedChar
{
  return esc;
}

Value = Number & SPECIAL_CHAR
{
  return {
    quote: '',
    literal: text(),
  };
}
/ '"' chars:DoubleQuotedChar* '"'
{
  return {
    quote: '"',
    literal: chars.join(''),
  };
}
/ first:NON_START_CHAR chars:NON_SPECIAL_CHAR*
{
  return {
    quote: '',
    literal: first + chars.join(''),
  };
}

// space or tab
SPACE_OR_TAB = [\x20\x09]

// CR or LF
NEWLINE = [\x0D\x0A]
NON_NEWLINE_CHAR = [^\x0D\x0A]

SPECIAL_CHAR = [:\x20\x09\x0D\x0A]
NON_SPECIAL_CHAR = [^:\x20\x09\x0D\x0A]
NON_START_CHAR = [^:"(\x20\x09\x0D\x0A]

EOF = !.
EOL = EOF / NEWLINE

Comment = '#' NON_NEWLINE_CHAR*

EmptyLine = SPACE_OR_TAB* ((Comment EOL) / NEWLINE)
{
  comments[location().start.offset] = text();

  return '';
}

TrailingComment = SPACE_OR_TAB+ Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}

MultiLineDelimiter = (TrailingComment / SPACE_OR_TAB*) NEWLINE SPACE_OR_TAB+
Delimiter = MultiLineDelimiter / SPACE_OR_TAB+
