{
  let comments = {};
}

PG = IgnoredLine* lines:(ContentLine IgnoredLine*)*
{
  return {
    lines: lines,
    comments: comments,
  };
}

ContentLine = e:(Edge / Node) TrailingSpace? EOL
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

Edge = i:ID WhiteSpace d:Direction WhiteSpace j:ID l:Label* p:Property*
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

Label = WhiteSpace ':' Space? l:String
{
  return l;
}

Property = WhiteSpace k:String Space? ':' WhiteSpace? v:ValueList
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

ValueList = v:Value a:(WhiteSpace? ',' WhiteSpace? Value)*
{
  let values = [v];

  a.forEach((v) => {
    values.push(v[3]);
  });

  return values;
}

WhiteSpace = (TrailingSpace? LineBreak)* Space

TrailingSpace = Space Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}
/ Space

IgnoredLine = Space? (Comment EOL / LineBreak)
{
  comments[location().start.offset] = text().replace(/\n$/, '');

  return '';
}

Comment = '#' [^\x0D\x0A]*

Direction = '--' / '->' / '<-'

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
Space = [\x20\x09]+

// CR or LF
LineBreak = [\x0D\x0A]

WORD_BOUNDARY = [:\x20\x09\x0D\x0A]
UNQUOTED = [^:\x20\x09\x0D\x0A\'\"(),]

EOL = EOF / LineBreak
EOF = !.
