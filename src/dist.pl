#!/usr/bin/perl
# -*- Mode: Perl; coding: utf-8; tab-width: 3; indent-tabs-mode: t; c-basic-offset: 3 -*-

use strict;
use warnings;
use v5.10.0;
use open qw/:std :utf8/;

my $CWD = `pwd`;
chomp $CWD;

say $CWD;

my $VERSION = `cat cobweb/Browser/VERSION.js`;
$VERSION =~ /"(.*?)"/;
$VERSION = $1;

sub dist {
	system "cp", "-v", "cobweb.css",                  "../dist/";
	system "cp", "-v", "spinner.css",                 "../dist/";
	system "cp", "-v", "cobweb.uncompressed.js",      "../dist/cobweb.js";
	system "cp", "-v", "cobweb.min.js",               "../dist/";
	system "cp", "-v", "-r", "images",                "../dist/";
	system "cp", "-v", "browser.html",                "../dist/";

	system "perl", "-pi", "-e", 's|\s*<script src="jam/require\.js"></script>\n||sg', "../dist/browser.html";
}

sub zip {
	my $ZIP_DIR = "cobweb-$VERSION";

	chdir "../";

	system "cp", "-r", "dist", $ZIP_DIR;

	system "zip", "-x", "*.mdproj", "-x", "*.zip", "-r", "$ZIP_DIR.zip", $ZIP_DIR;
	system "mv", "-v", "$ZIP_DIR.zip", "dist/";

	system "rm", "-v", "-r", $ZIP_DIR;
	chdir $CWD;
}

exit if $VERSION =~ /a$/;

say "Making version '$VERSION' now.";

dist;
zip;