/**
 * This parse function is a modified version of the Microlight Parser,
 * Original microlight by asvd <heliosframework@gmail.com>
 * Original microlight repository: http://github.com/asvd/microlight
 * 
 * This parser receives a code text and an options object. It will parse
 * the text and identify the different code elements. The code
 * elements are:
 * 
 * Ponctuation
 * String
 * Comment
 * Neutral Scope
 * Keywords
 * 
 * For each element a callback function will be called from { options }
 * object. The callbacks are:
 * 
 * formatPonctuation(t) { ... }
 * formatString(t) { ... }
 * formatComment(t) { ... }
 * formatKeyword(t) { ... }
 * 
 * Where <t> is the element found (a string). You can modify the string as you want it
 * and return the new modified string to compose the result.
 * 
 * To define which keywords the parser must consider, you must pass the { options.keywords }
 * option with an string[]. eg.:
 * 
 * [ 'const', 'var', 'let' ];
 * 
 * Example of usage:
 * 
 * parse('function test() { console.log("test")}', {
 *   keywords: [ 'function', 'console' ],
 * 
 *   formatKeyword(t) {
 *     // will find function and console
 *     // and will put it in uppercase
 *     // you must follow this example for
 *     // any kind of token modification
 *     return t.toUpperCase();
 *   },
 *   
 *   formatPonctuation(t) {
 *     return t;
 *   },
 *   
 *   formatString(t) {
 *     return t;
 *   },
 * 
 *   formatComment(t) {
 *     return t;
 *   }
 * });
 * 
 * Original microlight
 * @license MIT 
 * @copyright 2016 asvd <heliosframework@gmail.com>
 *
 * Parse Function
 * @license MIT
 * @copyright 2022 Felippe Regazio <felippe.moraes@zoho.com>
 */
module.exports = function parse(text = '', options = {}) {
  var pos   = 0;       // current position
  var next1 = text[0]; // next character
  var chr   = 1;       // current character
  var prev1;           // previous character
  var prev2;           // the one before the previous
  var token = '';      // current token content
  var result = [];
  
  // current token type:
  //  0: anything else (whitespaces / newlines)
  //  1: operator or brace
  //  2: closing braces (after which '/' is division not regex)
  //  3: (key)word
  //  4: regex
  //  5: string starting with "
  //  6: string starting with '
  //  7: xml comment  <!-- -->
  //  8: multiline comment /* */
  //  9: single-line comment starting with two slashes //
  // 10: single-line comment starting with hash #
  var tokenType = 0;
  
  // kept to determine between regex and division
  var lastTokenType;
  // flag determining if token is multi-character
  var multichar;
  
  // running through characters and highlighting
  while (prev2 = prev1,
    // escaping if needed (with except for comments)
    // pervious character will not be therefore
    // recognized as a token finalize condition
    prev1 = tokenType < 7 && prev1 == '\\' ? 1 : chr
  ) {
    chr = next1;
    next1=text[++pos];
    multichar = token.length > 1;
    // checking if current token should be finalized
    if (!chr  || // end of content
      // types 9-10 (single-line comments) end with a
      // newline
      (tokenType > 8 && chr == '\n') ||
      [ // finalize conditions for other token types
        // 0: whitespaces
        /\S/['test'](chr),  // merged together
        // 1: operators
        1,                // consist of a single character
        // 2: braces
        1,                // consist of a single character
        // 3: (key)word
        !/[$\w]/['test'](chr),
        // 4: regex
        (prev1 == '/' || prev1 == '\n') && multichar,
        // 5: string with "
        prev1 == '"' && multichar,
        // 6: string with '
        prev1 == "'" && multichar,
        // 7: xml comment
        text[pos-4]+prev2+prev1 == '-->',
        // 8: multiline comment
        prev2+prev1 == '*/'
      ][tokenType]
    ) {
      // appending the token to the result
      if (token) {
        // remapping token type into style
        // (some types are highlighted similarly)
        result.push([
          // 0: do not format
          (t) => t,
          // 1: keywords
          options.formatKeyword,
          // 2: punctuation
          options.formatPonctuation,
          // 3: strings and regexps
          options.formatString,
          // 4: comments
          options.formatComment
        ][
          // not formatted
          !tokenType ? 0 :
          // punctuation
          tokenType < 3 ? 2 :
          // comments
          tokenType > 6 ? 4 :
          // regex and strings
          tokenType > 3 ? 3 :
          // otherwise tokenType == 3, (key)word
          // (1 if regexp matches, 0 otherwise)
          + new RegExp(`^(${options.keywords.join('|')})$`, 'i').test(token)
        ](token));
      }
  
      // saving the previous token type
      // (skipping whitespaces and comments)
      lastTokenType = (tokenType && tokenType < 7) ? tokenType : lastTokenType;
  
      // initializing a new token
      token = '';
  
      // determining the new token type (going up the
      // list until matching a token type start
      // condition)
      tokenType = 11;
  
      while (![
        1, //  0: whitespace
        //  1: operator or braces
        /[\/{}[(\-+*=<>:;|\\.,?!&@~]/['test'](chr),
        /[\])]/['test'](chr),  //  2: closing brace
        /[$\w]/['test'](chr),  //  3: (key)word
        chr == '/' &&        //  4: regex
        // previous token was an
        // opening brace or an
        // operator (otherwise
        // division, not a regex)
        (lastTokenType < 2) &&
        // workaround for xml
        // closing tags
        prev1 != '<',
        chr == '"', //  5: string with "
        chr == "'", //  6: string with '
        //  7: xml comment
        chr+next1+text[pos+1]+text[pos+2] == '<!--',
        chr+next1 == '/*',   //  8: multiline comment
        chr+next1 == '//',   //  9: single-line comment
        chr == '#'           // 10: hash-style comment
      ][--tokenType]);
    }
  
    token += chr;
  }

  return result.join('');
}