### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl lib/pg.pegjs > docs/grammar.md
```

```ebnf
PG             ::= ( IgnoredLine* Statement )* IgnoredLine*
Statement      ::= ( Edge | Node ) ( WS Label )* ( WS Property )* TrailingSpace? EOL
Node           ::= ID
Edge           ::= ID WS DIRECTION WS ID | ID WS ID WS DIRECTION WS ID
ID             ::= !DIRECTION StringNonEmpty
Label          ::= ':' SPACE_OR_TAB* String
Property       ::= KeyDef Values
Values         ::= Value ( WS? ',' WS? Value )*
Value          ::= Number & WORD_BOUNDARY | BOOLEAN | String
Number         ::= '-'? INTEGER ( '.' [0-9]+ )? EXPONENT?
StringNonEmpty ::= QuotedNonEmpty | UNQUOTED_CHAR+
String         ::= QuotedString | UNQUOTED_CHAR+
KeyDef         ::= QuotedString SPACE_OR_TAB* ':' WS? | KeyDefUnquoted
KeyDefUnquoted ::= KeyWithColon ( ':' WS | SPACE_OR_TAB+ ':' WS? ) | WITHOUT_COLON+ SPACE_OR_TAB* ':' WS?
KeyWithColon   ::= WITHOUT_COLON ( ':' WITHOUT_COLON )+
QuotedNonEmpty ::= "'" SingleQuoted+ "'" | '"' DoubleQuoted+ '"' | '`' BackQuoted+ '`'
QuotedString   ::= "'" SingleQuoted* "'" | '"' DoubleQuoted* '"' | '`' BackQuoted* '`'
SingleQuoted   ::= "\\'" | [^']
DoubleQuoted   ::= '\\"' | [^"]
BackQuoted     ::= [^`] | '``'
IgnoredLine    ::= SPACE_OR_TAB* ( Comment EOL | NEWLINE )
TrailingSpace  ::= SPACE_OR_TAB+ Comment | SPACE_OR_TAB+
WS             ::= (TrailingSpace? NEWLINE)* SPACE_OR_TAB+
Comment        ::= '#' COMMENT_CHAR*
DIRECTION      ::= '--' | '->'
COMMENT_CHAR   ::= [^\x0D\x0A]
NEWLINE        ::= [\x0A] | [\x0D] [\x0A] | [\x0D]
SPACE_OR_TAB   ::= [\x20\x09]
WORD_BOUNDARY  ::= [\x20\x09\x0D\x0A,]
UNQUOTED_CHAR  ::= [^\x20\x09\x0D\x0A\'\"(),]
WITHOUT_COLON  ::= [^:\x20\x09\x0D\x0A\'\"(),]
INTEGER        ::= '0' | [1-9] [0-9]*
EXPONENT       ::= [eE] [+-]? [0-9]+
BOOLEAN        ::= 'true' | 'false'
EOL            ::= EOF | NEWLINE
EOF            ::= !.
```
