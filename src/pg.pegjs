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
/ i:ID ':' WS* j:ID WS d:DIRECTION WS k:ID
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

Property = k:Key v:ValueList
{
  return {
    key: k,
    values: v,
  };
}

ValueList = WS? v:Value a:( WS? ',' WS? @Value )*
{
  return [v, ...a];
}

Value = Number
{
  return {
    literal: Number(text()),
  };
}
/ BOOLEAN
/ QuotedString
/ UnquotedValue

UnquotedValue = UNQUOTED_START (!"," UNQUOTED_CHAR)*
{
  return {
    literal: text()
  }
}

Number = '-'? INTEGER ( '.' [0-9]+ )? EXPONENT?

ID = QuotedNonEmpty
/ UNQUOTED_START UNQUOTED_CHAR*
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

Key = s:QuotedString ':'
{
  return s;
}
/ KeyUnquoted

KeyUnquoted = @(UNQUOTED_START ( ( !":" UNQUOTED_CHAR )* ':' )+
{
  return {
    literal: text().slice(0,-1),
  };
} ) WS
/ UNQUOTED_START (!":" UNQUOTED_CHAR)* ':'
{
  return {
    literal: text().slice(0,-1),
  };
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

SingleQuoted = Unescaped / '"' / Escaped

DoubleQuoted = Unescaped / "'" / Escaped

// Excludes quoted, escape, and control codes but includes \t, \n, \r
Unescaped = [^\x00-\x08\x0B\x0C\x0E-\x1F"'\\]

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

Codepoint = digits:$( HEX |4| ) 
{
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
  = [^\x00-\x20<>"{}|^`\\]
UNQUOTED_START
  = ![:#,-] UNQUOTED_CHAR

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
