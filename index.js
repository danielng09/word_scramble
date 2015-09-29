var React = require('react')
var WordScrambleApp = require('./js/app.js')

React.render(
  <WordScrambleApp
    url='http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=500000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=7&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5' />,
  document.getElementById('root')
);