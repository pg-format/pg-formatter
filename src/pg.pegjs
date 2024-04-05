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

Edge = i:ID WS d:DIRECTION WS j:ID
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
/ i:ID SPACE_OR_TAB* ':' WS* j:ID WS d:DIRECTION WS k:ID
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

Property = k:KeyDef v:Values
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
/ BOOLEAN
/ String

Number = '-'? INTEGER ( '.' [0-9]+ )? EXPONENT?

ID = QuotedNonEmpty
/ WITHOUT_COLON+ ( ':' WITHOUT_COLON+ )*
{
  return {
    literal: text(),
  };
}

String = QuotedString
/ chars:UNQUOTED_CHAR+
{
  return {
    literal: chars.join(''),
  };
}

KeyDef = s:QuotedString SPACE_OR_TAB* ':' WS?
{
  return s;
}
/ KeyDefUnquoted

KeyDefUnquoted = k:KeyWithColon ( ':' WS / SPACE_OR_TAB+ ':' WS? )
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

KeyWithColon = WITHOUT_COLON+ ( ':' WITHOUT_COLON+ )+
{
  return text();
}

QuotedNonEmpty = "'" chars:SingleQuoted+ "'"
{
  return {
    quote: "'",
    literal: chars.join(''),
  };
}
/ '"' chars:DoubleQuoted+ '"'
{
  return {
    quote: '"',
    literal: chars.join(''),
  };
}
/ '`' chars:BackQuoted+ '`'
{
  return {
    quote: '`',
    literal: chars.join(''),
  };
}

QuotedString = "'" chars:SingleQuoted* "'"
{
  return {
    quote: "'",
    literal: chars.join(''),
  };
}
/ '"' chars:DoubleQuoted* '"'
{
  return {
    quote: '"',
    literal: chars.join(''),
  };
}
/ '`' chars:BackQuoted* '`'
{
  return {
    quote: '`',
    literal: chars.join(''),
  };
}

SingleQuoted = "\\'" / [^']

DoubleQuoted = '\\"' / [^"]

BackQuoted = [^`] / '``'

IgnoredLine = SPACE_OR_TAB* ( Comment EOL / NEWLINE )
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

Comment = '#' COMMENT_CHAR*

DIRECTION = '--' / '->'

COMMENT_CHAR = [^\x0D\x0A]
// LF | CR LF | CR
NEWLINE = [\x0A] / [\x0D] [\x0A] / [\x0D]
SPACE_OR_TAB = [\x20\x09]
WORD_BOUNDARY = [\x20\x09\x0D\x0A,]
UNQUOTED_CHAR "UNQUOTED_CHAR"
  = [^\x20\x09\x0D\x0A\'\"(),]
WITHOUT_COLON "WITHOUT_COLON"
  = [^:\x20\x09\x0D\x0A\'\"(),]

INTEGER "INTEGER"
  = '0' / [1-9] [0-9]*

EXPONENT = [eE] [+-]? [0-9]+

BOOLEAN = 'true'
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

EOL = EOF / NEWLINE
EOF = !.
