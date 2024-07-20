// PG format parser with additional information. 
//
// The result object consists of an array of `statements` and a `comments` object.
// Each statement is a PG-JSONL object with additional `pos`
// Properties are stored as array of `key` and `values` 
// Each identifier (`id`), property `key`, and value is an object with
// keys `value` (the actual value) and `literal` (its serialization)

{
  const statements = [];
  const comments = {};
  const quotedString = chars => ({
    literal: text(),
    value: chars.join(''),
  });
  const edgeIds = {}
}


/* 3.1 Basic Structure */

PG = ( Empty LineBreak / Statement ( LineBreak / END ) )* Empty 
{
  return { statements, comments };
}

Statement = s:( Edge / Node ) l:( DW @Label )* p:( DW @Property )* Empty
{
  s.labels = l;
  s.properties = p;
  s.pos.end = location().end.offset;
  statements.push(s);
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
  return { value: text(), literal: text() }
}

UnquotedChar "UnquotedChar"
  = [^\x00-\x20<>"{}|^`\\]

UnquotedStart
  = ![:#,-] UnquotedChar


/* 3.3 Nodes & 3.4 Edges */

Node = id:Identifier
{
  return {
    type: "node",
    id,
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
  const edge = { type: "edge", from, to, direction }
  if (id) {
    edge.id = id
    id = id.value || id.literal
    if (id in edgeIds) {
      error(`Repeated edge identifier: ${id}`)
    }
    edgeIds[id] = true
  }
  return {
    ...edge,
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
  const value = text().slice(0,-1) 
  return { value, literal: value }
}

QuotedKey = @QuotedNonEmpty ":"

UnquotedKey = UnquotedStart ( ( !":" UnquotedChar )* ":" )+
{
  const value = text().slice(0,-1) 
  return { value, literal: value }
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
  return { value: Number(text()), literal: text() }
}

Boolean = "true"
{
  return { value: true, literal: "true" } 
}
/ "false"
{
  return { value: false, literal: "false" }
}

UnquotedValue = UnquotedStart (!"," UnquotedChar)*
{
  return { literal: text(), value: text() }
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

