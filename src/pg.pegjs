{
  let comments = {};
}

PG = lines:( IgnoredLine* @Statement )* IgnoredLine*
{
  return {
    lines: lines,
    comments: comments,
  };
}

Statement = e:( Edge / Node ) TrailingSpace? EOL
{
  e.pos.end = location().end.offset;
  return e;
}

Node = i:ID l:( WS @Label )* p:( WS @Property )*
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

Edge = i:ID WS d:Direction WS j:ID l:( WS @Label )* p:( WS @Property )*
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

ID = StringNonEmpty

Label = ':' SPACE_OR_TAB* l:String
{
  return l;
}

Property = k:Key SPACE_OR_TAB* ':' WS? v:Values
{
  return {
    key: k,
    values: v,
  };
}

Values = v:Value a:( WS? ',' WS? @Value )*
{
  return [v, ...a];
}

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

Direction = '--' / '->'

Number = '-'? Integer ( '.' [0-9]+ )? Exponent?

Integer = '0' / [1-9] [0-9]*

Exponent = [eE] [+-]? [0-9]+

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

WS = (TrailingSpace? NEWLINE)* SPACE_OR_TAB+

TrailingSpace = SPACE_OR_TAB+ Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}
/ SPACE_OR_TAB+

IgnoredLine = SPACE_OR_TAB* ( Comment EOL / NEWLINE )
{
  comments[location().start.offset] = text().replace(/\n$/, '');

  return '';
}

Comment = '#' COMMENT_CHAR*

StringNonEmpty = QuotedNonEmpty
/ chars:UNQUOTED_COLON+
{
  return {
    literal: chars.join(''),
  };
}

String = QuotedString
/ chars:UNQUOTED_COLON+
{
  return {
    literal: chars.join(''),
  };
}

Key = QuotedString
/ chars:UNQUOTED+
{
  return {
    literal: chars.join(''),
  };
}

QuotedString = '"' chars:DoubleQuoted* '"'
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
/ "`" chars:BackQuoted* "`"
{
  return {
    quote: "`",
    literal: chars.join(''),
  };
}

QuotedNonEmpty = '"' chars:DoubleQuoted+ '"'
{
  return {
    quote: '"',
    literal: chars.join(''),
  };
}
/ "'" chars:SingleQuoted+ "'"
{
  return {
    quote: "'",
    literal: chars.join(''),
  };
}
/ "`" chars:BackQuoted+ "`"
{
  return {
    quote: "`",
    literal: chars.join(''),
  };
}

SingleQuoted = !( "'" / "\\" ) char:.
{
  return char;
}
/ "\\" esc:ESCAPED_CHAR
{
  return esc;
}

DoubleQuoted = !( '"' / "\\" ) char:.
{
  return char;
}
/ "\\" esc:ESCAPED_CHAR
{
  return esc;
}

BackQuoted = !( "`" / "\\" ) char:.
{
  return char;
}
/ "\\" esc:ESCAPED_CHAR
{
  return esc;
}

ESCAPED_CHAR = "'"
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

COMMENT_CHAR = [^\x0D\x0A]
// LF | CR LF | CR
NEWLINE = [\x0A] / [\x0D] [\x0A] / [\x0D]
SPACE_OR_TAB = [\x20\x09]
WORD_BOUNDARY = [\x20\x09\x0D\x0A,]
UNQUOTED_COLON = [^\x20\x09\x0D\x0A\'\"(),]
UNQUOTED = [^:\x20\x09\x0D\x0A\'\"(),]

EOL = EOF / NEWLINE
EOF = !.
