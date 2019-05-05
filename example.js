const { highlightWordsParser } = require('./index')

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
