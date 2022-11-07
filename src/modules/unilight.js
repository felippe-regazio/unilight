const parse = require('./parser');
const format = require('./formatter');

/**
 * This function receives a simple string and uses Unicode Variations
 * to highlight it. So we can have a rudimentary highlight for code
 * snippets almost in everywhere that accepts unicode text. The library 
 * is capable to highlight any language since the "keywords" array is
 * dynamic.
 * 
 * @license MIT
 * @copyright Felippe Regazio <felippe.moraes@zoho.com>
 * 
 * @param {string} text 
 * @param {string[]} keywords 
 * @returns A unicode string with highlighted code
 */
module.exports = function unilight(text, keywords = []) {
  return parse(text, {
    keywords,

    formatKeyword(t) {
      // return bold unicode
      return format(t, 'bs');
    },

    formatPonctuation(t) {
      // no formatting
      return t;
    },

    formatString(t) {
      // no formatting
      return t;
    },

    formatComment(t) {
      // return outlined unicode
      return format(t, 'd');
    }
  });
}