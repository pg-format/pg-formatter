### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl src/pg.pegjs > docs/grammar.md
```

```ebnf

/* 3.1 Basic Structure */
PG             ::= ( Empty LineBreak | Statement EOL )* Empty 
Statement      ::= ( Edge | Node ) ( DW Label )* ( DW Property )* Empty
Empty          ::= Spaces? Comment?
EOL            ::= LineBreak | END
END            ::= !.

/* 3.2 Identifiers */
Identifier     ::= QuotedNonEmpty | UnquotedStart UnquotedChar*
UnquotedChar   ::= [^\x00-\x20<>"{}|^`\\]
UnquotedStart  ::= ![:#,-] UnquotedChar

/* 3.3 Nodes & 3.4 Edges */
Node           ::= Identifier
Edge           ::= ( EdgeIdentifier )? ( Identifier DW )? Direction DW Identifier /* Identifier mandatory! */
EdgeIdentifier ::= QuotedKey DW | UnquotedKey !"#" DW
Direction      ::= '--' | '->'

/* 3.5 Labels */
Label          ::= ':' Spaces? Identifier

/* 3.6 Properties */
Property       ::= Key ValueList
Key            ::= QuotedKey | UnquotedKey DW | UnquotedStart (!":" UnquotedChar)* ':'
QuotedKey      ::= QuotedNonEmpty ':'
UnquotedKey    ::= UnquotedStart ( ( !":" UnquotedChar )* ':' )+
ValueList      ::= DW? Value ( DW? ',' DW? Value )*

/* 3.6.1 Property Values */
Value          ::= Number | Boolean | QuotedString | UnquotedValue
Number         ::= '-'? ('0' | [1-9] [0-9]*) ( '.' [0-9]+ )? ([eE] [+-]? [0-9]+)?
Boolean        ::= 'true' | 'false'
UnquotedValue  ::= UnquotedStart (!"," UnquotedChar)*

/* 3.7 Quoted Strings */
QuotedString   ::= "'" SingleQuoted* "'" | '"' DoubleQuoted* '"'
QuotedNonEmpty ::= "'" SingleQuoted+ "'" | '"' DoubleQuoted+ '"'
SingleQuoted   ::= Unescaped | '"' | Escaped
DoubleQuoted   ::= Unescaped | "'" | Escaped
Unescaped      ::= [^\x00-\x08\x0B\x0C\x0E-\x1F"'\\]
Escaped        ::= "\\" | "'" | "\\" | "/" | "b"  | "f"  | "n"  | "r"  | "t"  | "u" Codepoint
Codepoint      ::= [0-9a-fA-Z] |4|    /* Hexademical two byte number */

/* 3.8 Whitespace */
LineBreak      ::= [\x0A] | [\x0D] [\x0A]?
Spaces         ::= [\x20\x09]+
Comment        ::= '#' [^\x0D\x0A]*
DW             ::= (Empty LineBreak)* Spaces    /* Delimiting Whitespace */
```
