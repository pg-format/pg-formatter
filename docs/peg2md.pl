#!/usr/bin/perl -w
use v5.14.1;
use File::Basename;
use Getopt::Std;
my $PROGRAM = basename $0;
my $USAGE   = "Usage: $PROGRAM
-s: simple mode
-d: debug
";

my %OPT;
getopts( 'sd', \%OPT );

!@ARGV && -t and die $USAGE;

my @LINE;
while (<>) {
    chomp;
    if (/^\s*(=.*)/) {
        $LINE[-1] .= " $1";
    }
    elsif (/^ *(\/ [^{]*)/) {
        $LINE[-1] .= " $1";
    }
    elsif ( /^$/ || /^ / || /^{/ || /^}/ || /^\/\// ) {
    }
    elsif (/^(\S+) ".+"$/) {
        push( @LINE, $1 );
    }
    else {
        push( @LINE, $_ );
    }
}

my @TERM;
my @RULE;
my @TERM_LEN;
my $MAX_TERM_LEN = 0;
for my $line (@LINE) {
    say STDERR $line if $OPT{d};
    if ( $line =~ /^\/\*/ ) {
    }
    elsif ( $line =~ /(\S+) += (.+)/ ) {
        my ( $term, $rule ) = ( $1, $2 );
        next if $term eq 'END';

        my $term_len = length($term);
        $rule =~ s/[a-z]+://g;
        $rule =~ s/ \/ / \| /g;
        $rule =~ s/\@//g;
        $rule =~ s/^\$\(\s*(.+)\s*\)\s*$/$1/g;
        $rule =~ s/\\x([0-9A-F][0-9A-F])/#x$1/g;
        $rule =~ s/\\\\/\\/g;

        if ( $term eq 'Edge' ) {

            # hack because peggy parsing adds rule in code
            $rule =~ s/\( Identifier DW \)\?/Identifier DW/;
        }

        push( @TERM,     $term );
        push( @RULE,     $rule );
        push( @TERM_LEN, $term_len );

        if ( $term_len > $MAX_TERM_LEN ) {
            $MAX_TERM_LEN = $term_len;
        }
    }
    else {
        die $line;
    }
}

if ( !$OPT{s} ) {
    say "### PG grammar";
    say "";
    say "Summary of `pg.pegjs` are formatted like EBNF:";
    say "```";
    say "\$ ./docs/peg2md.pl src/pg.pegjs > docs/grammar.md";
    say "```";
    say "";
    say "```ebnf";
}
for ( my $i = 0 ; $i < @LINE ; $i++ ) {
    if ( $LINE[$i] =~ /^\/\*/ ) {
        say "";
        say $LINE[$i];
    }
    else {
        my $term = shift @TERM;
        my $rule = shift @RULE;
        my $len  = shift @TERM_LEN;

        my $space = " " x ( $MAX_TERM_LEN - $len );
        say "$term$space ::= $rule";
    }
}
if ( !$OPT{s} ) {
    say "```";
}
