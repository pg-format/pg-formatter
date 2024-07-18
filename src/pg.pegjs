{
  const lines = [];
  const comments = {};
  const quotedString = chars => ({
    quote: text()[0],
    literal: text().slice(1,-1),
    value: chars.join(''),
  });
  const edgeIds = {}
}


/* 3.1 Basic Structure */

PG = ( Empty LineBreak / Statement ( LineBreak / END ) )* Empty 
{
  return { lines, comments };
}

Statement = e:( Edge / Node ) l:( DW @Label )* p:( DW @Property )* Empty
{
  if (e.node) {
    e.node.labels = l;
    e.node.properties = p;
  } else if (e.edge) {
    e.edge.labels = l;
    e.edge.properties = p;
  }
  e.pos.end = location().end.offset;
  lines.push(e);
}

Empty = Spaces? c:Comment?
{
  if (c) comments[location().start.offset] = text();
}

END = !.


/* 3.2 Identifiers */

Identifier = QuotedNonEmpty
/ UnquotedStart UnquotedChar*
{
  return { literal: text() }
}

UnquotedChar "UnquotedChar"
  = [^\x00-\x20<>"{}|^`\\]

UnquotedStart
  = ![:#,-] UnquotedChar


/* 3.3 Nodes & 3.4 Edges */

Node = id:Identifier
{
  return {
    node: { id },
    pos: { start: location().start.offset },
  }
}

Edge = id:( EdgeIdentifier )? from:( @Identifier DW )? direction:Direction DW to:Identifier
{
  if (!id && !from) { expected("identifier") }
  if (!from) {
    if (id.literal) id.literal += ":"
    from = id
    id = null
  } 
  const edge = { from, to, direction }
  if (id) {
    edge.id = id
    if (id in edgeIds) {
      error(`Repeated edge identifier: ${id}`)
    }
    edgeIds[id] = true
  }
  return {
    edge,
    pos: { start: location().start.offset },
  }
}

EdgeIdentifier = @QuotedKey DW / @UnquotedKey !"#" DW

Direction = "--" / "->"


/* 3.5 Labels */

Label = ":" Spaces? @Identifier


/* 3.6 Properties */

Property = key:Key values:ValueList
{
  return { key, values };
}

Key = QuotedKey
/ @UnquotedKey DW
/ UnquotedStart (!":" UnquotedChar)* ":"
{
  return { literal: text().slice(0,-1) }
}

QuotedKey = @QuotedNonEmpty ":"

UnquotedKey = UnquotedStart ( ( !":" UnquotedChar )* ":" )+
{
  return { literal: text().slice(0,-1) }
}

ValueList = DW? a:Value b:( DW? "," DW? @Value )*
{
  return [a, ...b]
}

/* 3.6.1 Property Values */

Value = Number
/ Boolean
/ QuotedString
/ UnquotedValue

Number = "-"? ("0" / [1-9] [0-9]*) ( "." [0-9]+ )? ([eE] [+-]? [0-9]+)?
{
  return { literal: Number(text()) }
}

Boolean = "true"
{
  return { literal: true } 
}
/ "false"
{
  return { literal: false }
}

UnquotedValue = UnquotedStart (!"," UnquotedChar)*
{
  return { literal: text() }
}

/* 3.7 Quoted Strings */

QuotedString = "'" chars:SingleQuoted* "'"
{
  return quotedString(chars)
}
/ '"' chars:DoubleQuoted* '"'
{
  return quotedString(chars)
}

QuotedNonEmpty = "'" chars:SingleQuoted+ "'"
{
  return quotedString(chars)
}
/ '"' chars:DoubleQuoted+ '"'
{
  return quotedString(chars)
}

SingleQuoted = Unescaped / '"' / Escaped

DoubleQuoted = Unescaped / "'" / Escaped

Unescaped = [^\x00-\x08\x0B\x0C\x0E-\x1F"'\\]

Escaped
  = "\\" @( '"'
      / "'"
      / "\\"
      / "/"
      / "b" { return "\b" }
      / "f" { return "\f" }
      / "n" { return "\n" }
      / "r" { return "\r" }
      / "t" { return "\t" }
      / "u" @Codepoint )

Codepoint = [0-9a-fA-Z] [0-9a-fA-Z] [0-9a-fA-Z] [0-9a-fA-Z]
{
  return String.fromCharCode(parseInt(text(), 16))
}

/* 3.8 Whitespace */

LineBreak = [\x0A] / [\x0D] [\x0A]?

Spaces = [\x20\x09]+

Comment = $( "#" [^\x0D\x0A]* )

DW = (Empty LineBreak)* Spaces

