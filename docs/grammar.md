### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl src/pg.pegjs > docs/grammar.md
```

```ebnf
PG             ::= ( EmptyLine* Statement )* EmptyLine*
Statement      ::= ( Edge | Node ) ( WS Label )* ( WS Property )* TrailingSpace? EOL
Node           ::= ID
Edge           ::= ( ( EdgeID WS)? ) ( ( ID WS )? ) DIRECTION WS ID
EdgeID         ::= QuotedKey | UnquotedKey
Label          ::= ':' SPACES? String
Property       ::= Key ValueList
ValueList      ::= WS? Value ( WS? ',' WS? Value )*
Value          ::= Number | BOOLEAN | QuotedString | UnquotedValue
UnquotedValue  ::= UNQUOTED_START (!"," UNQUOTED_CHAR)*
Number         ::= '-'? INTEGER ( '.' [0-9]+ )? EXPONENT?
ID             ::= QuotedNonEmpty | UNQUOTED_START UNQUOTED_CHAR*
String         ::= QuotedString | UNQUOTED_CHAR+
Key            ::= QuotedKey | UnquotedKey WS | UNQUOTED_START (!":" UNQUOTED_CHAR)* ':'
QuotedKey      ::= QuotedString ':'
UnquotedKey    ::= UNQUOTED_START ( ( !":" UNQUOTED_CHAR )* ':' )+
QuotedNonEmpty ::= "'" SingleQuoted+ "'" | '"' DoubleQuoted+ '"'
QuotedString   ::= "'" SingleQuoted* "'" | '"' DoubleQuoted* '"'
SingleQuoted   ::= Unescaped | '"' | Escaped
DoubleQuoted   ::= Unescaped | "'" | Escaped
Unescaped      ::= [^\x00-\x08\x0B\x0C\x0E-\x1F"'\\]
Escaped        ::= "\\" | "'" | "\\" | "/" | "b"  | "f"  | "n"  | "r"  | "t"  | "u" Codepoint )
Codepoint      ::= $( HEX |4| ) 
EmptyLine      ::= SPACES? ( COMMENT EOL | LINE_BREAK )
TrailingSpace  ::= SPACES COMMENT | SPACES
WS             ::= (TrailingSpace? LINE_BREAK)* SPACES
DIRECTION      ::= '--' | '->'
COMMENT        ::= '#' [^\x0D\x0A]*
LINE_BREAK     ::= [\x0A] | [\x0D] [\x0A]?    // LF | CR LF | CR
SPACES         ::= [\x20\x09]+
HEX            ::= [0-9a-f]i
WORD_BOUNDARY  ::= [\x20\x09\x0D\x0A,]
UNQUOTED_CHAR  ::= [^\x00-\x20<>"{}|^`\\]
UNQUOTED_START ::= ![:#,-] UNQUOTED_CHAR
INTEGER        ::= '0' | [1-9] [0-9]*
EXPONENT       ::= [eE] [+-]? [0-9]+
BOOLEAN        ::= 'true' | 'false'
EOL            ::= LINE_BREAK | END
END            ::= !.
```
