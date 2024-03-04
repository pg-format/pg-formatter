#!/usr/bin/perl -w
use strict;
use File::Basename;
use Getopt::Std;
my $PROGRAM = basename $0;
my $USAGE=
"Usage: $PROGRAM
-s: simple mode
";

my %OPT;
getopts('s', \%OPT);

!@ARGV && -t and die $USAGE;

my @LINE;
while (<>) {
    chomp;
    if (/^$/ || /^ / || /^{/ || /^}/ || /^\/\//) {
    } elsif (/^\S+ = /) {
        push(@LINE, $_);
    } else {
        $LINE[-1] .= " $_";
    }
}

my @TERM;
my @RULE;
my @TERM_LEN;
my $MAX_TERM_LEN = 0;
for my $line (@LINE) {
    if ($line =~ /(\S+) = (.+)/) {
        my ($term, $rule) = ($1, $2);
        my $term_len = length($term);
        $rule =~ s/[a-z]+://g;
        $rule =~ s/ \/ / \| /g;
        push(@TERM, $term);
        push(@RULE, $rule);
        push(@TERM_LEN, $term_len);
        if ($term_len > $MAX_TERM_LEN) {
            $MAX_TERM_LEN = $term_len;
        }
    } else {
        die $line;
    }
}

if (!$OPT{s}) {
    print "### PG grammar\n";
    print "\n";
    print "Summary of `pg.pegjs` are formatted like EBNF:\n";
    print "```\n";
    print "\$ ./docs/peg2md.pl lib/pg.pegjs > docs/grammar.md\n";
    print "```\n";
    print "\n";
    print "```ebnf\n";
}
for (my $i=0; $i<@LINE; $i++) {
    my $space = " " x ($MAX_TERM_LEN - $TERM_LEN[$i]);
    print "$TERM[$i]$space ::= $RULE[$i]\n";
    
}
if (!$OPT{s}) {
    print "```\n";
}
