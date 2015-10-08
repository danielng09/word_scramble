'use strict';

var $ = require('jquery');

window.Utils = {
  WORDNIKURL: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=500000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=6&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
	
 	pointValues: {
    'e': 10,
    'a': 10,
    'i': 10,
    'o': 10,
    "n": 10,
    'r': 10,
    't': 10,
    'l': 10,
    's': 10,
    'u': 10,
    'd': 20,
    'g': 20,
    'b': 30,
    'c': 30,
    'm': 30,
    'p': 30,
    'f': 40,
    'h': 40,
    'v': 40,
    'w': 40,
    'y': 40,
    'k': 50,
    'j': 80,
    'x': 80,
    'q': 100,
    'z': 100
  },

  hasElementInArray: function (array, ele) {
  	for (var idx = 0; idx < array.length; idx++) {
      	if (array[idx] === ele ) {
      		return idx;	
      	}
    	}
  	return false;
  },

  calculateValue: function(word) {
    var total = 0;
    word.split('').forEach(function(char) {
      total += this.pointValues[char];
    }.bind(this))
    return total;
  },

  getDictionary: function () {
    $.get('words.txt', function(data) {
      var dictionary = [];
      data.split('\n').forEach(function(word) {
        dictionary[word] = true;
      });
      this.dictionary = dictionary;
    }.bind(this))
  },
}

module.exports = Utils