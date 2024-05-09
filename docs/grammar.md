### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl src/pg.pegjs > docs/grammar.md
```

```ebnf
PG             ::= ( EmptyLine* Statement )* EmptyLine*
Statement      ::= ( Edge | Node ) ( WS Label )* ( WS Property )* TrailingSpace? EOL
Node           ::= ID
Edge           ::= ID WS DIRECTION WS ID | ID ':' WS* ID WS DIRECTION WS ID
Label          ::= ':' SPACES? String
Property       ::= KeyDef Values
Values         ::= Value ( WS? ',' WS? Value )*
Value          ::= Number ( &WORD_BOUNDARY | END ) | BOOLEAN | QuotedString | UnquotedValue
UnquotedValue  ::= (!"," WITHOUT_COLON) (!"," UNQUOTED_CHAR)*
Number         ::= '-'? INTEGER ( '.' [0-9]+ )? EXPONENT?
ID             ::= QuotedNonEmpty | WITHOUT_COLON+ ( ':' WITHOUT_COLON+ )*
String         ::= QuotedString | UNQUOTED_CHAR+
KeyDef         ::= QuotedString SPACES? ':' WS? | KeyDefUnquoted
KeyDefUnquoted ::= KeyWithColon ( ':' WS | SPACES ':' WS? ) | WITHOUT_COLON+ SPACES? ':' WS?
KeyWithColon   ::= WITHOUT_COLON+ ( ':' WITHOUT_COLON+ )+
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
WITHOUT_COLON  ::= [^\x00-\x20<>"{}|^`\\:]
INTEGER        ::= '0' | [1-9] [0-9]*
EXPONENT       ::= [eE] [+-]? [0-9]+
BOOLEAN        ::= 'true' | 'false'
EOL            ::= LINE_BREAK | END
END            ::= !.
```
