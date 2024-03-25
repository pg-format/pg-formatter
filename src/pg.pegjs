{
  let comments = {};
}

PG = lines:(IgnoredLine* @NodeOrEdge)* IgnoredLine*
{
  return {
    lines: lines,
    comments: comments,
  };
}

NodeOrEdge = e:(Edge / Node) TrailingSpace? EOL
{
  e.pos.end = location().end.offset;
  return e;
}

Node = i:ID l:(WS @Label)* p:(WS @Property)*
{
  return {
    node: {
      id: i,
      labels: l,
      properties: p,
    },
    pos: {
      start: location().start.offset,
    }
  };
}

Edge = i:ID WS d:Direction WS j:ID l:(WS @Label)* p:(WS @Property)*
{
  return {
    edge: {
      from: i,
      to: j,
      direction: d,
      labels: l,
      properties: p,
    },
    pos: {
      start: location().start.offset,
    }
  };
}

Label = ':' SPACE_OR_TAB* l:String
{
  return l;
}

Property = k:String SPACE_OR_TAB* ':' WS? v:ValueList
{
  return {
    key: k,
    values: v,
  };
}

ID = String

Value = Number & WORD_BOUNDARY
{
  return {
    literal: Number(text()),
  };
}
/ Boolean
/ 'null'
{
  return {
    literal: null,
  };
}
/ String

ValueList = v:Value a:(WS? ',' WS? @Value)*
{
  return [v, ...a];
}

WS = (TrailingSpace? NEWLINE)* SPACE_OR_TAB+

TrailingSpace = SPACE_OR_TAB+ Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}
/ SPACE_OR_TAB+

IgnoredLine = SPACE_OR_TAB* (Comment EOL / NEWLINE)
{
  comments[location().start.offset] = text().replace(/\n$/, '');

  return '';
}

Comment = '#' NON_NEWLINE*

Direction = '--' / '->'

Number = '-'? Integer ('.' [0-9]+)? Exponent?

Integer = '0' / [1-9] [0-9]*

Exponent = [eE] [+-]? [0-9]+

String = '"' chars:DoubleQuoted* '"'
{
  return {
    quote: '"',
    literal: chars.join(''),
  };
}
/ "'" chars:SingleQuoted* "'"
{
  return {
    quote: "'",
    literal: chars.join(''),
  };
}
/ chars:UNQUOTED+
{
  return {
    literal: chars.join(''),
  };
}

DoubleQuoted = !('"' / "\\") char:.
{
  return char;
}
/ "\\" esc:Escaped
{
  return esc;
}

SingleQuoted = !("'" / "\\") char:.
{
  return char;
}
/ "\\" esc:Escaped
{
  return esc;
}

Escaped = "'"
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

Boolean = 'true'
{
  return {
    literal: true,
  };
}
/ 'false'
{
  return {
    literal: false,
  };
}

SPACE_OR_TAB = [\x20\x09]

// CR? LF
NEWLINE = [\x0D]? [\x0A]
NON_NEWLINE = [^\x0D\x0A]

WORD_BOUNDARY = [:\x20\x09\x0D\x0A]
UNQUOTED = [^:\x20\x09\x0D\x0A\'\"(),]

EOL = EOF / NEWLINE
EOF = !.
