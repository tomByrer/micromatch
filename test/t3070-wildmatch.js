/*!
 * Based on tests from <https://github.com/vmeurisse/wildmatch>,
 * which were extracted from the `github.com/git/git` repository
 * Version used: http://git.io/xDZI
 * @attribution
 */

var mm = require('..');
require('should');

describe('original wildmatch', function() {
  it('Basic wildmat features', function() {
    mm.isMatch('foo', 'foo').should.be.true;
    mm.isMatch('foo', 'bar').should.be.false;
    mm.isMatch('', '').should.be.true;
    mm.isMatch('foo', '???').should.be.true;
    mm.isMatch('foo', '??').should.be.false;
    mm.isMatch('foo', '*').should.be.true;
    mm.isMatch('foo', 'f*').should.be.true;
    mm.isMatch('foo', '*f').should.be.false;
    mm.isMatch('foo', '*foo*').should.be.true;
    mm.isMatch('foobar', '*ob*a*r*').should.be.true;
    mm.isMatch('aaaaaaabababab', '*ab').should.be.true;
    mm.isMatch('foo*', 'foo\\*').should.be.true;
    mm.isMatch('foobar', 'foo\\*bar').should.be.false;
    // mm.isMatch('f\\oo', 'f\\\\oo').should.be.true;
    mm.isMatch('ball', '*[al]?').should.be.true;
    mm.isMatch('ten', '[ten]').should.be.false;
    mm.isMatch('ten', '**[!te]').should.be.false;
    // mm.isMatch('ten', '**[!ten]').should.be.false;
    mm.isMatch('ten', 't[a-g]n').should.be.true;
    // mm.isMatch('ten', 't[!a-g]n').should.be.false;
    // mm.isMatch('ton', 't[!a-g]n').should.be.true;
    mm.isMatch('ton', 't[^a-g]n').should.be.true;
    mm.isMatch('a]b', 'a[]]b').should.be.false;
    // mm.isMatch('a-b', 'a[]-]b').should.be.true;
    // mm.isMatch('a]b', 'a[]-]b').should.be.true;
    mm.isMatch('aab', 'a[]-]b').should.be.false;
    // mm.isMatch('aab', 'a[]a-]b').should.be.true;
    mm.isMatch(']', ']').should.be.true;
    mm.isMatch('3', '[1-3]').should.be.true;
  });

  it('Various additional tests', function() {
    mm.isMatch('acrt', 'a[c-c]st').should.be.false;
    mm.isMatch('acrt', 'a[c-c]rt').should.be.true;
    mm.isMatch(']', '[!]-]').should.be.false;
    // mm.isMatch('a', '[!]-]').should.be.true;
    mm.isMatch('', '\\').should.be.false;
    mm.isMatch('\\', '\\').should.be.true;
    mm.isMatch('XXX/\\', '\\').should.be.false;
    // mm.isMatch('XXX/\\', '*/\\\\').should.be.true;
    mm.isMatch('foo', 'foo').should.be.true;
    mm.isMatch('@foo', '@foo').should.be.true;
    mm.isMatch('foo', '@foo').should.be.false;
    mm.isMatch('[ab]', '\\[ab]').should.be.true;
    mm.isMatch('[ab]', '[[]ab]').should.be.false;
    // mm.isMatch('[ab]', '[[:]ab]').should.be.true;
    mm.isMatch('[ab]', '[[::]ab]').should.be.false;
    mm.isMatch('[ab]', '[\\[:]ab]').should.be.false;
    mm.isMatch('?a?b', '\\??\\?b').should.be.true;
    // mm.isMatch('abc', '\\a\\b\\c').should.be.true;
    mm.isMatch('foo', '').should.be.false;
    mm.isMatch('foo/bar/baz/to', '**/t[o]').should.be.true;
  });

  it('Character class tests', function() {
    // mm.isMatch('ab', '[[:digit]ab]').should.be.true;
    mm.isMatch('A', '[[:lower:]]').should.be.false;
    mm.isMatch('A', '[![:lower:]]').should.be.true;
    mm.isMatch('a', '[![:lower:]]').should.be.false;
    mm.isMatch('a', '[[:lower:]]').should.be.true;
    mm.isMatch('a', '[[:upper:]]').should.be.false;
    mm.isMatch('A', '[[:upper:]]').should.be.true;
    mm.isMatch('a', '[[:digit:][:upper:][:space:]]').should.be.false;
    mm.isMatch('A', '[[:digit:][:upper:][:space:]]').should.be.true;
    mm.isMatch('1', '[[:digit:][:upper:][:space:]]').should.be.true;
    mm.isMatch(' ', '[[:digit:][:upper:][:space:]]').should.be.true;
    mm.isMatch('.', '[[:digit:][:upper:][:space:]]').should.be.false;
    mm.isMatch('5', '[[:xdigit:]]').should.be.true;
    mm.isMatch('f', '[[:xdigit:]]').should.be.true;
    mm.isMatch('D', '[[:xdigit:]]').should.be.true;
    mm.isMatch('.', '[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]').should.be.true;
    mm.isMatch('.', '[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]').should.be.false;
    mm.isMatch('5', '[a-c[:digit:]x-z]').should.be.true;
    mm.isMatch('b', '[a-c[:digit:]x-z]').should.be.true;
    mm.isMatch('y', '[a-c[:digit:]x-z]').should.be.true;
    mm.isMatch('q', '[a-c[:digit:]x-z]').should.be.false;
  });

  it('malformed wildmats:', function() {
    mm.isMatch(']', '[\\\\-^]').should.be.true;
    mm.isMatch('[', '[\\\\-^]').should.be.false;
    mm.isMatch('-', '[\\-_]').should.be.true;
    // mm.isMatch(']', '[\\]]').should.be.true;
    mm.isMatch('\\]', '[\\]]').should.be.false;
    mm.isMatch('\\', '[\\]]').should.be.false;
    mm.isMatch('ab', 'a[]b').should.be.false;
    mm.isMatch('a[]b', 'a[]b').should.be.true;
    mm.isMatch('ab[', 'ab[').should.be.true;
    mm.isMatch('ab', '[!').should.be.false;
    mm.isMatch('ab', '[-').should.be.false;
    mm.isMatch('-', '[-]').should.be.true;
    mm.isMatch('-', '[a-').should.be.false;
    mm.isMatch('-', '[!a-').should.be.false;
    mm.isMatch('-', '[--A]').should.be.true;
    mm.isMatch('5', '[--A]').should.be.true;
    mm.isMatch(' ', '[ --]').should.be.true;
    mm.isMatch('$', '[ --]').should.be.true;
    mm.isMatch('-', '[ --]').should.be.true;
    mm.isMatch('0', '[ --]').should.be.false;
    mm.isMatch('-', '[---]').should.be.true;
    mm.isMatch('-', '[------]').should.be.true;
    mm.isMatch('j', '[a-e-n]').should.be.false;
    mm.isMatch('-', '[a-e-n]').should.be.true;
    // mm.isMatch('a', '[!------]').should.be.true;
    mm.isMatch('[', '[]-a]').should.be.false;
    mm.isMatch('^', '[]-a]').should.be.false;
    // mm.isMatch('^', '[!]-a]').should.be.false;
    // mm.isMatch('[', '[!]-a]').should.be.true;
    mm.isMatch('^', '[a^bc]').should.be.true;
    // mm.isMatch('-b]', '[a-]b]').should.be.true;
    mm.isMatch('\\', '[\\]').should.be.false;
    mm.isMatch('\\', '[\\\\]').should.be.true;
    // mm.isMatch('\\', '[!\\\\]').should.be.false;
    mm.isMatch('G', '[A-\\\\]').should.be.true;
    mm.isMatch('aaabbb', 'b*a').should.be.false;
    mm.isMatch('aabcaa', '*ba*').should.be.false;
    mm.isMatch(',', '[,]').should.be.true;
    // mm.isMatch(',', '[\\\\,]').should.be.true;
    mm.isMatch('\\', '[\\\\,]').should.be.true;
    mm.isMatch('-', '[,-.]').should.be.true;
    mm.isMatch('+', '[,-.]').should.be.false;
    mm.isMatch('-.]', '[,-.]').should.be.false;
    // mm.isMatch('2', '[\\1-\\3]').should.be.true;
    // mm.isMatch('3', '[\\1-\\3]').should.be.true;
    mm.isMatch('4', '[\\1-\\3]').should.be.false;
    mm.isMatch('\\', '[[-\\]]').should.be.true;
    mm.isMatch('[', '[[-\\]]').should.be.true;
    mm.isMatch(']', '[[-\\]]').should.be.true;
    mm.isMatch('-', '[[-\\]]').should.be.false;
  });

  it('Test recursion and the abort code', function() {
    mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*').should.be.true;
    mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*').should.be.false;
    mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*').should.be.false;
    mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*').should.be.true;
    mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*').should.be.false;
    mm.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t').should.be.true;
    mm.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t').should.be.false;
    mm.isMatch('foo', '*/*/*').should.be.false;
    mm.isMatch('foo/bar', '*/*/*').should.be.false;
    mm.isMatch('foo/bba/arr', '*/*/*').should.be.true;
    mm.isMatch('foo/bb/aa/rr', '*/*/*').should.be.false;
    mm.isMatch('foo/bb/aa/rr', '**/**/**').should.be.true;
    mm.isMatch('abcXdefXghi', '*X*i').should.be.true;
    mm.isMatch('ab/cXd/efXg/hi', '*X*i').should.be.false;
    mm.isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i').should.be.true;
    mm.isMatch('ab/cXd/efXg/hi', '**/*X*/**/*i').should.be.true;
  });

  it('Test pathName option', function() {
    mm.isMatch('foo', 'foo').should.be.true;
    mm.isMatch('foo', 'fo').should.be.false;
    mm.isMatch('foo/bar', 'foo/bar').should.be.true;
    mm.isMatch('foo/bar', 'foo/*').should.be.true;
    mm.isMatch('foo/bba/arr', 'foo/*').should.be.false;
    mm.isMatch('foo/bba/arr', 'foo/**').should.be.true;
    mm.isMatch('foo/bba/arr', 'foo*').should.be.false;
    mm.isMatch('foo/bba/arr', 'foo**').should.be.false;
    mm.isMatch('foo/bba/arr', 'foo/*arr').should.be.false;
    mm.isMatch('foo/bba/arr', 'foo/**arr').should.be.true;
    mm.isMatch('foo/bba/arr', 'foo/*z').should.be.false;
    mm.isMatch('foo/bba/arr', 'foo/**z').should.be.false;
    mm.isMatch('foo/bar', 'foo?bar').should.be.false;
    mm.isMatch('foo/bar', 'foo[/]bar').should.be.true;
    mm.isMatch('foo', '*/*/*').should.be.false;
    mm.isMatch('foo/bar', '*/*/*').should.be.false;
    mm.isMatch('foo/bba/arr', '*/*/*').should.be.true;
    mm.isMatch('foo/bb/aa/rr', '*/*/*').should.be.false;
    mm.isMatch('abcXdefXghi', '*X*i').should.be.true;
    mm.isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i').should.be.true;
    mm.isMatch('ab/cXd/efXg/hi', '*Xg*i').should.be.false;
  });

  it('Case-sensitivy features', function() {
    mm.isMatch('A', '[[:lower:]]').should.be.false;
    mm.isMatch('a', '[[:lower:]]').should.be.true;
    mm.isMatch('a', '[[:upper:]]').should.be.false;
    mm.isMatch('A', '[[:upper:]]').should.be.true;
    mm.isMatch('a', '[A-Z]').should.be.false;
    mm.isMatch('A', '[a-z]').should.be.false;
    mm.isMatch('A', '[A-Z]').should.be.true;
    mm.isMatch('a', '[a-z]').should.be.true;
    mm.isMatch('A', '[B-a]').should.be.false;
    mm.isMatch('a', '[B-a]').should.be.true;
    mm.isMatch('A', '[B-Za]').should.be.false;
    mm.isMatch('a', '[B-Za]').should.be.true;
    mm.isMatch('z', '[Z-y]').should.be.false;
    mm.isMatch('Z', '[Z-y]').should.be.true;
  });
});
