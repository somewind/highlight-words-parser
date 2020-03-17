function splitByKeywords (text, rules) {
  const texts = []
  let keywords = []
  rules.forEach(item => {
    if (Array.isArray(item.value)) {
      keywords.push.apply(keywords, item.value.map(word => ({
        color: item.color,
        value: word
      })))
    } else {
      keywords.push(Object.assign({}, item))
    }
  })
  keywords.forEach(item => {
    item.index = text.indexOf(item.value)
  })
  keywords = keywords.filter(item => item.index !== -1)
  keywords.sort((a, b) => a.index - b.index)
  let processCount = 0
  let partText = text
  keywords.forEach(item => {
    const realIndex = item.index - processCount
    texts.push({
      value: partText.substr(0, realIndex)
    })
    delete item.index
    texts.push(item)
    partText = partText.substr(realIndex + item.value.length)
    processCount += item.value.length + realIndex
  })
  if (partText) {
    texts.push({
      value: partText
    })
  }
  return texts.filter(t => t.value)
}

function splitByScopes (texts, rules) {
  const output = []
  texts.forEach(t => {
    const text = t.value
    if (!t.color) {
      let startRuleIndex = -1
      let startIndex = -1
      const pairs = []
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (startRuleIndex === -1) {
          startRuleIndex = rules.findIndex(r => r.value[0] === char)
          startIndex = i
        } else if (rules[startRuleIndex].value[1] === char) {
          pairs.push({
            color: rules[startRuleIndex].color,
            startIndex,
            endIndex: i + 1
          })
          startRuleIndex = -1
          startIndex = -1
        }
      }
      if (pairs.length === 0) {
        output.push(t)
      } else {
        let partText = text
        let processCount = 0
        pairs.forEach(p => {
          const realStartIndex = p.startIndex - processCount
          const realEndIndex = p.endIndex - processCount
          output.push({
            value: partText.substring(0, realStartIndex)
          })
          output.push({
            color: p.color,
            value: partText.substring(realStartIndex, realEndIndex)
          })
          partText = partText.substring(realEndIndex)
          processCount += realEndIndex
        })
        if (partText) {
          output.push({
            value: partText
          })
        }
      }
    } else {
      output.push(t)
    }
  })
  return output
}

module.exports.highlightWordsParser = function (text, options = {
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
}) {
  if (!options) {
    throw new Error('options can not be null.')
  }
  const texts = splitByKeywords(text, options.keywords)
  return splitByScopes(texts, options.scopes)
}
