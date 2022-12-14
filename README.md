# Unilight

Unilight is a unicode string highlighter. It uses `unicode variations` to highlight raw strings for almost any programming language. The output can be used anywhere that accepts unicode chars. Unilight has no dependencies, e.g.

```
/**
  * ππππ€ ππ€ π π‘π¦π£π π€π₯π£πππ π π¦π₯π‘π¦π₯, πͺπ π¦ πππ π‘ππ€π₯π ππ₯ πππͺπ¨πππ£π
  * π₯πππ₯ π€π¦π‘π‘π π£π₯π€ π¦ππππ ππ πππ π₯ππ πππππππππ₯π€ π¨πππ ππ π‘π£ππ€ππ£π§ππ
  **/
π³ππ»π°ππΆπΌπ» example() {
  π°πΌπ»ππ a = "fizz";
  π°πΌπ»ππ b = "buzz";

  // ππππ€ ππ€ ππ ππππππ ππ πππππ₯
  πΏπ²πππΏπ» `${a}${b}`;
}
```

## Basic Usage

> If you want to simply highlight a code string to use it anywhere, you can use the GUI tool available in this link: https://felippe-regazio.github.io/unilight/

If you want to highlight strings programatically, create your own highlighter, parse a source code string and modify its tokens, derive a tool from this library or anything else, keep reading this documentation.

## Using Programatically

First install the unilight as a dependency

```
npm install unilight
```

Then require or import `unilight` (or just the `highlight` method). Call the `highlight` method passing a collection of keywords to be highlighted. Styles for comments, strings and ponctuation will be automatically inferred:

```js
const { highlight } = require('unilight');

const code = `
  // This is an example

  function example() {
    const a = "fizz";
    const b = "buzz";
    return a+b;
  }
`;

const uTextHighlighted = highlight(code, [
  'function',
  'const',
  'return',
  'var',
  'let',
  // ...
]);
```

The output will be:

```
  // ππππ€ ππ€ ππ ππ©πππ‘ππ

  π³ππ»π°ππΆπΌπ» example() {
    π°πΌπ»ππ a = "fizz";
    π°πΌπ»ππ b = "buzz";
    πΏπ²πππΏπ» a+b;
  }
```

## Structure

Unilight is structured in 3 different modules: the `parser`, the `formatter` and the `highlighter`:

### The Parser

The parser can parse almost any source code in any language. It receives a string input, a keyword list and some formatting callbacks. It will parse the source code string and run a callback for every diffent kind of token found. For each token type there will be a `formatting callback` which you can use to modify the token output. Unilight will identify 5 different token types:

- Neutral (no formatting)
- Keyword
- Ponctuation
- String
- Comment

You can import the parser from unilight and use like this:

```js
const { parse } = require('unilight');

const code = `
  // THIS IS AN EXAMPLE

  function example() {
    const a = "fizz";
    const b = "buzz";
    return a+b;
  }
`;

parse(code, {
  keywords: [ 'function', 'const', 'return' ],

  formatKeyword(t) {
    // this callback will be called for all the keywords
    // defined in { keywords }. you can return a modified
    // version of the string found to modify the output.
    // this is the general rule for all the other callbacks.
    // for example, lets output all keywords in uppercase:

    return t.toUpperCase();
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
    // comments will be lowercased
    return t.toLowerCase();
  }
});
```

The output would be:

```
// this is an example

FUNCTION example() {
  CONST a = "fizz";
  CONST b = "buzz";
  RETURN a+b;
}
```

The parser was orinally developed by Helios (ASVD) for `microlight` lib and slightly modified to be used on this library.

### The Formatter

The formatter is a module that can convert a normal unicode string to some variation like `bold`, `italic`, `outlined` and others. It was originally developed by `David Konrad` as `toUnicodeVariant` lib. Unilight uses a modified version on this library. You can check the original source of the formatter and its usage here: https://github.com/davidkonrad/toUnicodeVariant

To use `toUnicodeVariant` on `unilight` you must do:

```js
const { format } = require('unilight');

const result = format('This is an example', 'd');

console.log(result);
```

The output will be:

```
ππππ€ ππ€ ππ ππ©πππ‘ππ
```

On the code above, `d` tells the formatter which variation to use while formating the string. The available variations are:

|Variant     | Alias | Description                   | Example           |
|:--------- |:-----:|:----------------------------- |:----------------- |
| monospace |   m   | Monospace      | πππππππππ |
| bold   |   b   | Bold text                        |ππ¨π₯π  |
| italic  |  i  | Italic text                       | ππ‘ππππ  |
| bold italic   |   bi   | bold+italic text   | ππππ ππππππ |
| script     |   c   | Handwriting style         | ππΈππΎππ    |
| bold script  |  bc   | Bolder handwriting     | π«πΈπ΅π­ πΌπ¬π»π²πΉπ½      |
| gothic  |   g   |Gothic (fraktur)            | π€π¬π±π₯π¦π       |
| gothic bold  |   gb   | Gothic in bold| ππππππ ππππ        |
| doublestruck |   d   | Outlined text        | ππ π¦ππππ€π₯π£π¦ππ |
| ππΊππ   |  s   | Sans-serif style    | ππΊππ |
| bold ππΊππ   |  bs   | Bold sans-serif   | π―πΌπΉπ± ππ?π»π |
| italic ππΊππ   |  is   | Italic sans-serif  | πͺπ΅π’π­πͺπ€ π΄π’π―π΄ |
| bold italic sans  |  bis   | Bold italic sans-serif  | ππ€π‘π ππ©ππ‘ππ π¨ππ£π¨ |
| circled  |  o   | Letters within circles   | βββ‘ββββ |
| circled negative |  on   | -- negative  | 	πππ‘ππππ |
| squared  |  q   | Letters within squares   | ππππ°ππ΄π³ |
| squared negative  |  qn   | -- negative  | ππππ°ππ΄π³
| paranthesis   |  p   | Letters within paranthesis  | β«ββ­β β©β―β£β β?β€ |
| fullwidth  | w   | Wider monospace font   | ο½ο½ο½ο½ο½ο½ο½ο½ο½ |

### The Highlighter

The unilight highlighter is just a pre-configured `parser` and `formatter` that you can use to highlight raw strings. You can use the highlighter by import the `highlight` function from `unilight`.

```js
const { highlight } = require('unilight');

const output = highlight(code, [ 'function', 'const', 'var', /** goes on... **/ ]);
```

THe unicode formatting for keywords and comments will be automatically applied. You can also create your own highlighter.

## Creating your own Highlighter

Use the snippet below to create your own Highlighter. You dont have to rely on unicode variations, you can modify the tokens as you prefer. This would be a `Rich Code Highlighter` to be used on an HTML page for example:

```js
const { parse, format } = require('unilight');

function customHighlighter(text) {
  return parse(text, {
    keywords: [ 'function', 'return' ],

    formatKeyword(t) {
      return `<span class="highlight-keyword">${t}</span>`;
    },

    formatPonctuation(t) {
      return `<span class="highlight-ponctuation">${t}</span>`;
    },

    formatString(t) {
      return `<span class="highlight-string">${t}</span>`;
    },

    formatComment(t) {
      return `<span class="highlight-comment">${t}</span>`;
    }
  });
}

// usage

const output = customHighlighter(`
  function example() {
    console.log("This is just an example");

    return true;
  }
`);
```

The code above will find tokens and surround them with a `span` identified by a custom class depending on the token type. You can use this class to style the output on an HTML page.

## Developing

Unilight is a colletion of modules that builds to an UMD under the global name `unilight` using parcel bundler.

### Dev dependencies

Before start, install dev dependencies

```
npm install
```

### Build

```
npm run build
```

### Test

```js
npm run test
```

### Running GUI editor locally

```
npm run start
```

### The keywords.js file

This file is used by the GUI Editor (index.html) to serve different collections of keywords for different programming languages.

### Adding new languagues to the GUI Editor

Just open the `keywords.js` file on the project root, add a new property with the language name you want to add, and an array of strings containing each keyword you want to be highlighted.

## Caveats

This is a toy project and it was made for aesthetics only. Some of the caveats of a unicode highlighter are:

1. Environments that don't support unicode can show a broken text
2. Since unicode variations are basically hidden chars, the resulting string may be longer than it looks
3. Interpreters won't run the code because the keywords will not be recognized
4. The unicode characters may vary from one system to another

## Credits

Unilight was written by Felippe Regazio.

Special thanks to David Konrad, which created the module `Unicode Variations` that can modify a unicode string and apply new variations. This is used by Unilight to highlight the string.

Special thanks to Helios (ASVD) that created Microlight Highlighter. His `parsing techiniques` were a strong inspiration and direct reference to Unilight parser, which uses part of his code.
