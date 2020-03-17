"use strict";

function splitByKeywords(text, rules) {
  var texts = [];
  var keywords = [];
  rules.forEach(function (item) {
    if (Array.isArray(item.value)) {
      keywords.push.apply(keywords, item.value.map(function (word) {
        return {
          color: item.color,
          value: word
        };
      }));
    } else {
      keywords.push(Object.assign({}, item));
    }
  });
  keywords.forEach(function (item) {
    item.index = text.indexOf(item.value);
  });
  keywords = keywords.filter(function (item) {
    return item.index !== -1;
  });
  keywords.sort(function (a, b) {
    return a.index - b.index;
  });
  var processCount = 0;
  var partText = text;
  keywords.forEach(function (item) {
    var realIndex = item.index - processCount;
    texts.push({
      value: partText.substr(0, realIndex)
    });
    delete item.index;
    texts.push(item);
    partText = partText.substr(realIndex + item.value.length);
    processCount += item.value.length + realIndex;
  });

  if (partText) {
    texts.push({
      value: partText
    });
  }

  return texts.filter(function (t) {
    return t.value;
  });
}

function splitByScopes(texts, rules) {
  var output = [];
  texts.forEach(function (t) {
    var text = t.value;

    if (!t.color) {
      var startRuleIndex = -1;
      var startIndex = -1;
      var pairs = [];

      var _loop = function _loop(i) {
        var char = text[i];

        if (startRuleIndex === -1) {
          startRuleIndex = rules.findIndex(function (r) {
            return r.value[0] === char;
          });
          startIndex = i;
        } else if (rules[startRuleIndex].value[1] === char) {
          pairs.push({
            color: rules[startRuleIndex].color,
            startIndex: startIndex,
            endIndex: i + 1
          });
          startRuleIndex = -1;
          startIndex = -1;
        }
      };

      for (var i = 0; i < text.length; i++) {
        _loop(i);
      }

      if (pairs.length === 0) {
        output.push(t);
      } else {
        var partText = text;
        var processCount = 0;
        pairs.forEach(function (p) {
          var realStartIndex = p.startIndex - processCount;
          var realEndIndex = p.endIndex - processCount;
          output.push({
            value: partText.substring(0, realStartIndex)
          });
          output.push({
            color: p.color,
            value: partText.substring(realStartIndex, realEndIndex)
          });
          partText = partText.substring(realEndIndex);
          processCount += realEndIndex;
        });

        if (partText) {
          output.push({
            value: partText
          });
        }
      }
    } else {
      output.push(t);
    }
  });
  return output;
}

module.exports.highlightWordsParser = function (text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    keywords: [{
      color: 'red',
      value: ['Error']
    }],
    scopes: [{
      color: 'green',
      value: ['"', '"']
    }, {
      color: 'green',
      value: ['(', ')']
    }]
  };

  if (!options) {
    throw new Error('options can not be null.');
  }

  var texts = splitByKeywords(text, options.keywords);
  return splitByScopes(texts, options.scopes);
};