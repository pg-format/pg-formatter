{
  let comments = {};
}

PG = lines:Lines* SkippedLine*
{
  return {
    lines: lines,
    comments: comments,
  };
}

Lines = SkippedLine* e:(Edge / Node) TrailingSpace? EOL
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

Edge = f:ID WS+ d:Direction WS+ t:ID l:Label* p:Property*
{
  return {
    edge: {
      from: f,
      to: t,
      direction: d,
      labels: l,
      properties: p,
    },
    pos: {
      start: location().start.offset,
    }
  };
}

ID = Integer & ELEMENT_BOUNDARY
{
  return {
    literal: Number(text()),
  };
}
/ String

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

ValueList = a:ValueAnd* v:Value
{
  a.push(v);
  return a;
}

ValueAnd = v:Value WS? ',' WS?
{
  return v;
}

Value = Number & ELEMENT_BOUNDARY
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

String = '"' chars:DoubleQuotedChar* '"'
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
/ chars:UNQUOTED_CHAR+
{
  return {
    literal: chars.join(''),
  };
}

// space or tab
SPACE_OR_TAB = [\x20\x09]

// CR or LF
NEWLINE = [\x0D\x0A]
NON_NEWLINE_CHAR = [^\x0D\x0A]

ELEMENT_BOUNDARY = [:\x20\x09\x0D\x0A]
UNQUOTED_CHAR = [^:\x20\x09\x0D\x0A\'\"(),]

EOF = !.
EOL = EOF / NEWLINE

Comment = '#' NON_NEWLINE_CHAR*

SkippedLine = SPACE_OR_TAB* ((Comment EOL) / NEWLINE)
{
  comments[location().start.offset] = text().replace(/\n$/, '');

  return '';
}

TrailingSpace = SPACE_OR_TAB+ Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}
/ SPACE_OR_TAB+

WS = (TrailingSpace? NEWLINE)* SPACE_OR_TAB+
