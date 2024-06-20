### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl src/pg.pegjs > docs/grammar.md
```

```ebnf

/* 3.1 Basic Structure */
PG             ::= ( Empty LineBreak | Statement ( LineBreak | END ) )* Empty 
Statement      ::= ( Edge | Node ) ( DW Label )* ( DW Property )* Empty
Empty          ::= Spaces? Comment?
Identifier     ::= QuotedNonEmpty | UnquotedStart UnquotedChar*

/* 3.2 Identifiers */
UnquotedChar   ::= [^#x00-#x20<>"{}|^`\]
UnquotedStart  ::= ![:#,-] UnquotedChar
Node           ::= Identifier

/* 3.3 Nodes & 3.4 Edges */
Edge           ::= ( EdgeIdentifier )? Identifier DW Direction DW Identifier
EdgeIdentifier ::= QuotedKey DW | UnquotedKey !"#" DW
Direction      ::= "--" | "->"
Label          ::= ":" Spaces? Identifier

/* 3.5 Labels */
Property       ::= Key ValueList

/* 3.6 Properties */
Key            ::= QuotedKey | UnquotedKey DW | UnquotedStart (!":" UnquotedChar)* ":"
QuotedKey      ::= QuotedNonEmpty ":"
UnquotedKey    ::= UnquotedStart ( ( !":" UnquotedChar )* ":" )+
ValueList      ::= DW? Value ( DW? "," DW? Value )*
Value          ::= Number | Boolean | QuotedString | UnquotedValue

/* 3.6.1 Property Values */
Number         ::= "-"? ("0" | [1-9] [0-9]*) ( "." [0-9]+ )? ([eE] [+-]? [0-9]+)?
Boolean        ::= "true" | "false"
UnquotedValue  ::= UnquotedStart (!"," UnquotedChar)*
QuotedString   ::= "'" SingleQuoted* "'" | '"' DoubleQuoted* '"'

/* 3.7 Quoted Strings */
QuotedNonEmpty ::= "'" SingleQuoted+ "'" | '"' DoubleQuoted+ '"'
SingleQuoted   ::= Unescaped | '"' | Escaped
DoubleQuoted   ::= Unescaped | "'" | Escaped
Unescaped      ::= [^#x00-#x08#x0B#x0C#x0E-#x1F"'\]
Escaped        ::= "\" ( '"' | "'" | "\" | "/" | "b"  | "f"  | "n"  | "r"  | "t"  | "u" Codepoint )
Codepoint      ::= [0-9a-fA-Z] [0-9a-fA-Z] [0-9a-fA-Z] [0-9a-fA-Z]
LineBreak      ::= [#x0A] | [#x0D] [#x0A]?

/* 3.8 Whitespace */
Spaces         ::= [#x20#x09]+
Comment        ::= "#" [^#x0D#x0A]* 
DW             ::= (Empty LineBreak)* Spaces
               ::= 
```
