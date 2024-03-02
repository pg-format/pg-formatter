{
  let comments = {};
}

PG = lines:NodeOrEdgeLine* IgnoredLine*
{
  return {
    lines: lines,
    comments: comments,
  };
}

NodeOrEdgeLine = IgnoredLine* e:(Edge / Node) TrailingSpace? EOL
{
  e.pos.end = location().end.offset;
  return e;
}

Node = i:ID l:Label* p:Property*
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

Edge = i:ID WS d:Direction WS j:ID l:Label* p:Property*
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

Label = WS ':' SPACE_OR_TAB* l:Value
{
  return l;
}

Property = WS k:String SPACE_OR_TAB* ':' WS? v:ValueList
{
  return {
    key: k,
    values: v,
  };
}

ID = Integer & WORD_BOUNDARY
{
  return {
    literal: Number(text()),
  };
}
/ String

Value = Number & WORD_BOUNDARY
{
  return {
    literal: Number(text()),
  };
}
/ 'true'
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
/ 'null'
{
  return {
    literal: null,
  };
}
/ String

ValueAnd = v:Value WS? ',' WS?
{
  return v;
}

ValueList = a:ValueAnd* v:Value
{
  a.push(v);
  return a;
}

WS = (TrailingSpace? NEWLINE)* SPACE_OR_TAB+

TrailingSpace = SPACE_OR_TAB+ Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}
/ SPACE_OR_TAB+

IgnoredLine = SPACE_OR_TAB* ((Comment EOL) / NEWLINE)
{
  comments[location().start.offset] = text().replace(/\n$/, '');

  return '';
}

Comment = '#' NON_NEWLINE*

Direction = '--' / '->'

Number = '-'? Integer ('.' [0-9]+)? Exp?

Integer = '0' / [1-9] [0-9]*

Exp = [eE] ('-' / '+')? [0-9]+

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

// space or tab
SPACE_OR_TAB = [\x20\x09]

// CR or LF
NEWLINE = [\x0D\x0A]
NON_NEWLINE = [^\x0D\x0A]

WORD_BOUNDARY = [:\x20\x09\x0D\x0A]
UNQUOTED = [^:\x20\x09\x0D\x0A\'\"(),]

EOL = EOF / NEWLINE
EOF = !.
