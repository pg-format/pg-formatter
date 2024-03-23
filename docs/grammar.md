### PG grammar

Summary of `pg.pegjs` are formatted like EBNF:
```
$ ./docs/peg2md.pl lib/pg.pegjs > docs/grammar.md
```

```ebnf
PG            ::= (IgnoredLine* NodeOrEdge)* IgnoredLine*
NodeOrEdge    ::= (Edge | Node) TrailingSpace? EOL
Node          ::= ID (WS Label)* (WS Property)*
Edge          ::= ID WS Direction WS ID (WS Label)* (WS Property)*
Label         ::= ':' SPACE_OR_TAB* String
Property      ::= String SPACE_OR_TAB* ':' WS? ValueList
ID            ::= Integer & WORD_BOUNDARY | String
Value         ::= Number & WORD_BOUNDARY | Boolean | 'null' | String
ValueList     ::= Value (WS? ',' WS? Value)*
WS            ::= (TrailingSpace? NEWLINE)* SPACE_OR_TAB+
TrailingSpace ::= SPACE_OR_TAB+ Comment | SPACE_OR_TAB+
IgnoredLine   ::= SPACE_OR_TAB* (Comment EOL | NEWLINE)
Comment       ::= '#' NON_NEWLINE*
Direction     ::= '--' | '->'
Number        ::= '-'? Integer ('.' [0-9]+)? Exp?
Integer       ::= '0' | [1-9] [0-9]*
Exp           ::= [eE] ('-' | '+')? [0-9]+
String        ::= '"' DoubleQuoted* '"' | "'" SingleQuoted* "'" | UNQUOTED+
DoubleQuoted  ::= !('"' | "\\") . | "\\" Escaped
SingleQuoted  ::= !("'" | "\\") . | "\\" Escaped
Escaped       ::= "'" | '"' | "\\" | "b" | "f" | "n" | "r" | "t" | "v"
Boolean       ::= 'true' | 'false'
SPACE_OR_TAB  ::= [\x20\x09]
NEWLINE       ::= [\x0D\x0A]
NON_NEWLINE   ::= [^\x0D\x0A]
WORD_BOUNDARY ::= [:\x20\x09\x0D\x0A]
UNQUOTED      ::= [^:\x20\x09\x0D\x0A\'\"(),]
EOL           ::= EOF | NEWLINE
EOF           ::= !.
```
