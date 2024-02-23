{
  let nodeCount = 0;
  let edgeCount = 0;
  let comments = {};
}

PG = lines:NodeOrEdge* CommentLine*
{
  const commentsArr = Object.entries(comments).map(([pos, text]) => ({
    pos: parseInt(pos),
    text: text,
  }));

  return {
    nodes: lines.map(l => l.node).filter(v => v),
    edges: lines.map(l => l.edge).filter(v => v),
    nodeCount: nodeCount,
    edgeCount: edgeCount,
    comments: commentsArr,
  }
}

NodeOrEdge = n:Node
{
  return {
    node: n
  }
}
/ e:Edge
{
  return {
    edge: e
  }
}

Node = CommentLine* WS* id:Value l:Label* p:Property* InlineComment EndOfLine
{
  nodeCount++;

  return {
    id: id,
    labels: l,
    properties: p
  }
}

Edge = CommentLine* WS* f:Value WS+ d:Direction WS+ t:Value l:Label* p:Property* InlineComment EndOfLine
{
  edgeCount++;

  return {
    from: f,
    to: t,
    direction: d,
    labels: l,
    properties: p
  }
}

Label = Delimiter ':' WS* l:Value
{
  return l
}

Property = Delimiter k:Value WS* ':' WS* v:Value
{
  return {
    key: k,
    value: v
  }
}

Direction = '--' / '->'

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

SingleQuotedChar = !("'" / "\\") char:.
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
/ "'" chars:SingleQuotedChar* "'"
{
  return {
    quote: "'",
    literal: chars.join(''),
  };
}
/ chars:NON_SPECIAL_CHAR+
{
  return {
    quote: '',
    literal: chars.join(''),
  };
}

// space or tab
WS = [\u0020\u0009]

SPECIAL_CHAR = [:\u0020\u0009\u000D\u000A]

NON_SPECIAL_CHAR = [^:\u0020\u0009\u000D\u000A]

// CR or LF
NEWLINE = [\u000D\u000A]

NON_NEWLINE = [^\u000D\u000A]

EOF = !.

EndOfLine = EOF / NEWLINE

CommentLine = WS* (('#' NON_NEWLINE* EndOfLine) / NEWLINE)
{
  comments[location().start.offset] = text();

  return '';
}

InlineComment = (WS+ '#' WS+ NON_NEWLINE*) / WS*

Delimiter = (InlineComment NEWLINE WS+) / WS+
