{
  let comments = {};
}

PG = lines:( EmptyLine* @Statement )* EmptyLine*
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
/ i:ID SPACES? ':' WS* j:ID WS d:DIRECTION WS k:ID
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

Label = ':' SPACES? l:String
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
/ UNQUOTED_CHAR+
{
  return {
    literal: text(),
  };
}

KeyDef = s:QuotedString SPACES? ':' WS?
{
  return s;
}
/ KeyDefUnquoted

KeyDefUnquoted = k:KeyWithColon ( ':' WS / SPACES ':' WS? )
{
  return {
    literal: k,
  };
}
/ chars:WITHOUT_COLON+ SPACES? ':' WS?
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

SingleQuoted = [^'\\] / Escaped

DoubleQuoted = [^"\\] / Escaped

BackQuoted = [^`] / '``'

Escaped
  = "\\"
    sequence:(
        '"'
      / "'"
      / "\\"
      / "/"
      / "b" { return "\b" }
      / "f" { return "\f" }
      / "n" { return "\n" }
      / "r" { return "\r" }
      / "t" { return "\t" }
      / "u" @Codepoint )
    // As code formatter this ignores the character value but returns escape sequence
    { return text() }

Codepoint
  = digits:$( HEX |4| ) {
      return String.fromCharCode(parseInt(digits, 16))
    }

EmptyLine = SPACES? ( COMMENT EOL / LINE_BREAK )
{
  comments[location().start.offset] = text().replace(/\n$/, '');

  return '';
}

TrailingSpace = SPACES COMMENT
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}
/ SPACES

WS = (TrailingSpace? LINE_BREAK)* SPACES

// Terminal symbols

DIRECTION = '--' / '->'

COMMENT = '#' [^\x0D\x0A]*

LINE_BREAK = [\x0A] / [\x0D] [\x0A]?    // LF | CR LF | CR

SPACES = [\x20\x09]+

HEX = [0-9a-f]i

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

EOL = LINE_BREAK / END
END = !.
