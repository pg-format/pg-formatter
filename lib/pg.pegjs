{
  let nodeCount = 0;
  let edgeCount = 0;
  let comments = {};
}

PG = lines:( Node / Edge )* EmptyLine*
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

Node = EmptyLine* WS* id:Value l:Label* p:Property* InlineComment EOL
{
  nodeCount++;

  return {
    node: {
      id: id,
      labels: l,
      properties: p
    }
  }
}

Edge = EmptyLine* WS* f:Value WS+ d:Direction WS+ t:Value l:Label* p:Property* InlineComment EOL
{
  edgeCount++;

  return {
    edge: {
      from: f,
      to: t,
      direction: d,
      labels: l,
      properties: p
    }
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
WS = [\x20\x09]

// CR or LF
NEWLINE = [\x0D\x0A]
NON_NEWLINE = [^\x0D\x0A]

SPECIAL_CHAR = [:\x20\x09\x0D\x0A]
NON_SPECIAL_CHAR = [^:\x20\x09\x0D\x0A]

EOF = !.
EOL = EOF / NEWLINE

EmptyLine = WS* (('#' NON_NEWLINE* EOL) / NEWLINE)
{
  comments[location().start.offset] = text();

  return '';
}

InlineComment = (WS+ '#' WS+ NON_NEWLINE*) / WS*

Delimiter = (InlineComment NEWLINE WS+) / WS+
