import React from 'react';

url = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=200000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
$.get(url, function(data) {
  $word = data.word;
})

$.get('http://localhost:8080/words.txt', function(data) {
  $dictionary = {};
  data.toLowerCase().split('\n').forEach(function(word) {
    $dictionary[word] = true;
  });
})

var findValue = function(word) {
  var total = 0;
  word.split('').forEach(function(char) {
    total += values[char];
  })
  return total;
}

var values = {
    'e': 1,
    'a': 1,
    'i': 1,
    'o': 1,
    "n": 1,
    'r': 1,
    't': 1,
    'l': 1,
    's': 1,
    'u': 1,
    'd': 2,
    'g': 2,
    'b': 3,
    'c': 3,
    'm': 3,
    'p': 3,
    'f': 4,
    'h': 4,
    'v': 4,
    'w': 4,
    'y': 4,
    'k': 5,
    'j': 8,
    'x': 8,
    'q': 10,
    'z': 10
};
