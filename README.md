# Highlight Words Parser

## Features

Parse a give string to highlight words.

## Installation

```shell
yarn add highlight-words-parser
```

or

```shell
npm i highlight-words-parser --save
```

## Usage

```js
import { highlightWordsParser } from 'highlight-words-parser'

const highlightWords = highlightWordsParser('Error: this is a "test" message (from somewind)', {
  keywords: [{
    color: 'red',
    value: [
      'Error'
    ]
  }],
  scopes: [
    {
      color: 'green',
      value: ['"', '"']
    },
    {
      color: 'green',
      value: ['(', ')']
    }
  ]
})

console.log(highlightWords)

// Output:
//
// [ { color: 'red', value: 'Error' },
//   { value: ': this is a ' },
//   { color: 'green', value: '"test"' },
//   { value: ' message ' },
//   { color: 'green', value: '(from somewind)' } ]
```

You can use the result to render with `React` or other. 

## License

[MIT](./LICENSE)
