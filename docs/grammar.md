### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl lib/pg.pegjs > docs/grammar.md
```

```ebnf
PG             ::= ( IgnoredLine* Statement )* IgnoredLine*
Statement      ::= ( Edge | Node ) ( WS Label )* ( WS Property )* TrailingSpace? EOL
Node           ::= ID
Edge           ::= ID WS Direction WS ID | ID WS ID WS Direction WS ID
ID             ::= !( '--' | '->' ) StringNonEmpty
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
StringNonEmpty ::= QuotedNonEmpty | UNQUOTED_CHAR+
String         ::= QuotedString | UNQUOTED_CHAR+
Key            ::= QuotedString | WITHOUT_COLON+
QuotedString   ::= '"' DoubleQuoted* '"' | "'" SingleQuoted* "'" | "`" BackQuoted* "`"
QuotedNonEmpty ::= '"' DoubleQuoted+ '"' | "'" SingleQuoted+ "'" | "`" BackQuoted+ "`"
SingleQuoted   ::= !( "'" | "\\" ) . | "\\" ESCAPED_CHAR
DoubleQuoted   ::= !( '"' | "\\" ) . | "\\" ESCAPED_CHAR
BackQuoted     ::= !( "`" | "\\" ) . | "\\" ESCAPED_CHAR
ESCAPED_CHAR   ::= "'" | '"' | "\\" | "b" | "f" | "n" | "r" | "t" | "v"
COMMENT_CHAR   ::= [^\x0D\x0A]
NEWLINE        ::= [\x0A] | [\x0D] [\x0A] | [\x0D]
SPACE_OR_TAB   ::= [\x20\x09]
WORD_BOUNDARY  ::= [\x20\x09\x0D\x0A,]
UNQUOTED_CHAR  ::= [^\x20\x09\x0D\x0A\'\"(),]
WITHOUT_COLON  ::= [^:\x20\x09\x0D\x0A\'\"(),]
EOL            ::= EOF | NEWLINE
EOF            ::= !.
```
