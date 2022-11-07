# Unilight

Unilight is a unicode string highlighter. It uses `unicode variations` to highlight raw strings for almoast any programming language. The output can be used anywhere that accepts unicode chars. Unilight has no dependencies, e.g.

```
/**
  * 𝕋𝕙𝕚𝕤 𝕚𝕤 𝕒 𝕡𝕦𝕣𝕖 𝕤𝕥𝕣𝕚𝕟𝕘 𝕠𝕦𝕥𝕡𝕦𝕥, 𝕪𝕠𝕦 𝕔𝕒𝕟 𝕡𝕒𝕤𝕥𝕖 𝕚𝕥 𝕒𝕟𝕪𝕨𝕙𝕖𝕣𝕖
  * 𝕥𝕙𝕒𝕥 𝕤𝕦𝕡𝕡𝕠𝕣𝕥𝕤 𝕦𝕟𝕚𝕔𝕠𝕕𝕖 𝕒𝕟𝕕 𝕥𝕙𝕖 𝕙𝕚𝕘𝕙𝕝𝕚𝕘𝕙𝕥𝕤 𝕨𝕚𝕝𝕝 𝕓𝕖 𝕡𝕣𝕖𝕤𝕖𝕣𝕧𝕖𝕕
  **/
𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻 example() {
  𝗰𝗼𝗻𝘀𝘁 a = "fizz";
  𝗰𝗼𝗻𝘀𝘁 b = "buzz";

  // 𝕋𝕙𝕚𝕤 𝕚𝕤 𝕒𝕟 𝕚𝕟𝕝𝕚𝕟𝕖 𝕔𝕠𝕞𝕞𝕖𝕟𝕥
  𝗿𝗲𝘁𝘂𝗿𝗻 `${a}${b}`;
}
```

## Basic Usage

> If you want to simply highlight a code string to use it anywhere, you can use the GUI tool available in this link: https://test.com

If you want to highlight strings programatically, create your own highlighter, parse a source code string and modify its tokens, derive a tool from this library or anything else, keep reading this documentation.

## Using Programatically

First install the unilight as a dependency

```
npm install unilight
```

Now require or import `unilight` (or just the `highlight` method). Then call the `highlight` method passing a collection of keywords to be highlighted. Styles for comments, strings and ponctuation will be automatically infered:

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
  // 𝕋𝕙𝕚𝕤 𝕚𝕤 𝕒𝕟 𝕖𝕩𝕒𝕞𝕡𝕝𝕖

  𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻 example() {
    𝗰𝗼𝗻𝘀𝘁 a = "fizz";
    𝗰𝗼𝗻𝘀𝘁 b = "buzz";
    𝗿𝗲𝘁𝘂𝗿𝗻 a+b;
  }
```

## Structure

Unilight is structured in 3 different modules: the `parser`, the `formatter` and `unilight` itself:

### The Parser

The parser can parse almost any source code in any language. It receives a string input, a keyword list and some formatting callbackss. It will parse the source code string and run a callback to every diffent kind of token found. For each token types there will be a `formatting callback` which you can use to modify the token output. Unilight will identify 5 different token types:

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
𝕋𝕙𝕚𝕤 𝕚𝕤 𝕒𝕟 𝕖𝕩𝕒𝕞𝕡𝕝𝕖
```

On the code above, `d` tells the formatter which variation to use while formating the string. The available variations are:

|Variant     | Alias | Description                   | Example           |
|:--------- |:-----:|:----------------------------- |:----------------- |
| monospace |   m   | Monospace      | 𝚖𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎 |
| bold   |   b   | Bold text                        |𝐛𝐨𝐥𝐝  |
| italic  |  i  | Italic text                       | 𝑖𝑡𝑎𝑙𝑖𝑐  |
| bold italic   |   bi   | bold+italic text   | 𝒃𝒐𝒍𝒅 𝒊𝒕𝒂𝒍𝒊𝒄 |
| script     |   c   | Handwriting style         | 𝓈𝒸𝓇𝒾𝓅𝓉    |
| bold script  |  bc   | Bolder handwriting     | 𝓫𝓸𝓵𝓭 𝓼𝓬𝓻𝓲𝓹𝓽      |
| gothic  |   g   |Gothic (fraktur)            | 𝔤𝔬𝔱𝔥𝔦𝔠      |
| gothic bold  |   gb   | Gothic in bold| 𝖌𝖔𝖙𝖍𝖎𝖈 𝖇𝖔𝖑𝖉        |
| doublestruck |   d   | Outlined text        | 𝕕𝕠𝕦𝕓𝕝𝕖𝕤𝕥𝕣𝕦𝕔𝕜 |
| 𝗌𝖺𝗇𝗌   |  s   | Sans-serif style    | 𝗌𝖺𝗇𝗌 |
| bold 𝗌𝖺𝗇𝗌   |  bs   | Bold sans-serif   | 𝗯𝗼𝗹𝗱 𝘀𝗮𝗻𝘀 |
| italic 𝗌𝖺𝗇𝗌   |  is   | Italic sans-serif  | 𝘪𝘵𝘢𝘭𝘪𝘤 𝘴𝘢𝘯𝘴 |
| bold italic sans  |  bis   | Bold italic sans-serif  | 𝙗𝙤𝙡𝙙 𝙞𝙩𝙖𝙡𝙞𝙘 𝙨𝙖𝙣𝙨 |
| circled  |  o   | Letters within circles   | ⓒⓘⓡⓒⓛⓔⓓ |
| circled negative |  on   | -- negative  | 	🅒🅘🅡🅒🅛🅔🅓 |
| squared  |  q   | Letters within squares   | 🅂🅀🅄🄰🅁🄴🄳 |
| squared negative  |  qn   | -- negative  | 🆂🆀🆄🅰🆁🅴🅳
| paranthesis   |  p   | Letters within paranthesis  | ⒫⒜⒭⒠⒩⒯⒣⒠⒮⒤ |
| fullwidth  | w   | Wider monospace font   | ｆｕｌｌｗｉｄｔｈ |

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

The code above will find tokens and sorround them with a `span` identified by a custom class depending on the token type. You can use this classes style the output on an HTML page.

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

## Credits

Unilight was written by Felippe Regazio.

Special thanks to David Konrad, which created the module `Unicode Variations` that can modify a unicode string and apply new variations. This is used by Unilight to highlight the string.

Special thanks to Helios (ASVD) that created Microlight Highlighter. His `parsing techiniques` where a strong inspiration and direct reference to Unilight parser, which uses part of his code.