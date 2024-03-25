### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl lib/pg.pegjs > docs/grammar.md
```

```ebnf
PG             ::= ( IgnoredLine* Statement )* IgnoredLine*
Statement      ::= ( Edge | Node ) TrailingSpace? EOL
Node           ::= ID ( WS Label )* ( WS Property )*
Edge           ::= ID WS Direction WS ID ( WS Label )* ( WS Property )*
ID             ::= String
Label          ::= ':' SPACE_OR_TAB* String
Property       ::= Key SPACE_OR_TAB* ':' WS? Values
Values         ::= Value ( WS? ',' WS? Value )*
Value          ::= Number & WORD_BOUNDARY | Boolean | 'null' | String
Direction      ::= '--' | '->'
Number         ::= '-'? Integer ( '.' [0-9]+ )? Exponent?
Integer        ::= '0' | [1-9] [0-9]*
Exponent       ::= [eE] [+-]? [0-9]+
Boolean        ::= 'true' | 'false'
WS             ::= (TrailingSpace? NEWLINE)* SPACE_OR_TAB+
TrailingSpace  ::= SPACE_OR_TAB+ Comment | SPACE_OR_TAB+
IgnoredLine    ::= SPACE_OR_TAB* ( Comment EOL | NEWLINE )
Comment        ::= '#' COMMENT_CHAR*
String         ::= QuotedString | UNQUOTED_COLON+
Key            ::= QuotedString | UNQUOTED+
QuotedString   ::= '"' DoubleQuoted* '"' | "'" SingleQuoted* "'" | "`" BackQuoted* "`"
SingleQuoted   ::= !( "'" | "\\" ) . | "\\" ESCAPED_CHAR
DoubleQuoted   ::= !( '"' | "\\" ) . | "\\" ESCAPED_CHAR
BackQuoted     ::= !( "`" | "\\" ) . | "\\" ESCAPED_CHAR
ESCAPED_CHAR   ::= "'" | '"' | "\\" | "b" | "f" | "n" | "r" | "t" | "v"
COMMENT_CHAR   ::= [^\x0D\x0A]
NEWLINE        ::= [\x0A] | [\x0D] [\x0A] | [\x0D]
SPACE_OR_TAB   ::= [\x20\x09]
WORD_BOUNDARY  ::= [:\x20\x09\x0D\x0A\'\"(),]
UNQUOTED_COLON ::= [^\x20\x09\x0D\x0A\'\"(),]
UNQUOTED       ::= [^:\x20\x09\x0D\x0A\'\"(),]
EOL            ::= EOF | NEWLINE
EOF            ::= !.
```
