{
  let comments = {};
}

PG = lines:( NodeLine / EdgeLine )* EmptyLine*
{
  const commentsArr = Object.entries(comments).map(([pos, text]) => ({
    pos: parseInt(pos),
    text: text.trimEnd(),
  }));

  return {
    lines: lines,
    comments: commentsArr,
  }
}

NodeLine = EmptyLine* n:Node (TrailingComment / SPACE_OR_TAB*) EOL
{
  n.node.pos.end = location().end.offset;
  return n;
}

EdgeLine = EmptyLine* e:Edge (TrailingComment / SPACE_OR_TAB*) EOL
{
  e.edge.pos.end = location().end.offset;
  return e;
}

Node = i:Identifier l:Label* p:Property*
{
  return {
    node: {
      id: i,
      labels: l,
      properties: p,
      pos: {
        start: location().start.offset,
      }
    }
  }
}

Edge = f:Identifier SPACE_OR_TAB+ d:Direction SPACE_OR_TAB+ t:Value l:Label* p:Property*
{
  return {
    edge: {
      from: f,
      to: t,
      direction: d,
      labels: l,
      properties: p,
      pos: {
        start: location().start.offset,
      }
    }
  }
}

Identifier = Integer & SPECIAL_CHAR
{
  return {
    quote: '',
    literal: Number(text()),
  };
}
/ String

Label = Delimiter ':' SPACE_OR_TAB* l:Value
{
  return l
}

Property = Delimiter k:String SPACE_OR_TAB* ':' SPACE_OR_TAB* v:ValueList
{
  return {
    key: k,
    values: v
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

ValueList = a:ValueAnd* v:Value
{
  a.push(v);
  return a;
}

ValueAnd = v:Value Delimiter? ',' Delimiter?
{
  return v;
}

Value = Number & SPECIAL_CHAR
{
  return {
    quote: '',
    literal: Number(text()),
  };
}
/ 'true'
{
  return {
    quote: '',
    literal: true,
  };
}
/ 'false'
{
  return {
    quote: '',
    literal: false,
  };
}
/ 'null'
{
  return {
    quote: '',
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
    quote: '',
    literal: chars.join(''),
  };
}

// space or tab
SPACE_OR_TAB = [\x20\x09]

// CR or LF
NEWLINE = [\x0D\x0A]
NON_NEWLINE_CHAR = [^\x0D\x0A]

SPECIAL_CHAR = [:\x20\x09\x0D\x0A]
UNQUOTED_CHAR = [^:\x20\x09\x0D\x0A\'\"(),]

EOF = !.
EOL = EOF / NEWLINE

Comment = '#' NON_NEWLINE_CHAR*

EmptyLine = SPACE_OR_TAB* ((Comment EOL) / NEWLINE)
{
  comments[location().start.offset] = text();

  return '';
}

TrailingComment = SPACE_OR_TAB+ Comment
{
  const pos = location().start.offset;
  comments[pos] = text();

  return '';
}

MultiLineDelimiter = (TrailingComment / SPACE_OR_TAB*) NEWLINE SPACE_OR_TAB+
Delimiter = MultiLineDelimiter / SPACE_OR_TAB+
