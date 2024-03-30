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

Statement = e:( Edge / Node ) l:( WS @Label )* p:( WS @Property )* TrailingSpace? EOL
{
  if (e.node) {
    e.node.labels = l;
    e.node.properties = p;
  } else if (e.edge) {
    e.edge.labels = l;
    e.edge.properties = p;
  }
  e.pos.end = location().end.offset;
  return e;
}

Node = i:ID
{
  return {
    node: {
      id: i,
    },
    pos: {
      start: location().start.offset,
    }
  };
}

Edge = i:ID WS d:Direction WS j:ID
{
  return {
    edge: {
      from: i,
      to: j,
      direction: d,
    },
    pos: {
      start: location().start.offset,
    }
  };
}
/ i:ID WS j:ID WS d:Direction WS k:ID
{
  return {
    edge: {
      id: i,
      from: j,
      to: k,
      direction: d,
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

Property = k:Key v:Values
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

ID = !Direction s:StringNonEmpty
{
  return s;
}

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
/ chars:UNQUOTED_CHAR+
{
  return {
    literal: chars.join(''),
  };
}

String = QuotedString
/ chars:UNQUOTED_CHAR+
{
  return {
    literal: chars.join(''),
  };
}

Key = s:QuotedString SPACE_OR_TAB* ':' WS?
{
  return s;
}
/ k:KeyWithColon ( ':' WS / SPACE_OR_TAB+ ':' WS?)
{
  return {
    literal: k,
  };
}
/ chars:WITHOUT_COLON+ SPACE_OR_TAB* ':' WS?
{
  return {
    literal: chars.join(''),
  };
}

KeyWithColon = WITHOUT_COLON ( ':' WITHOUT_COLON )+
{
  return text();
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
UNQUOTED_CHAR = [^\x20\x09\x0D\x0A\'\"(),]
WITHOUT_COLON = [^:\x20\x09\x0D\x0A\'\"(),]

EOL = EOF / NEWLINE
EOF = !.
