var React = require('react');
var $ = require('jquery')

var app = app || {};

(function () {
  // 'use strict';

  var WordScrambleApp = React.createClass({
    componentWillMount: function () {
      this.getWordFromWordNikAPI();
      this.getDictionaryLocally();
    },

    componentDidMount: function() {
      $(document.body).on('keydown', this.handleKeyDown);
    },

    getWordFromWordNikAPI: function () {
      $.get(this.props.url, function(data) {
        var word = data.word.toLowerCase()
        var scrambledLetters = this.scrambleWordtoLetters(word)
        this.setState({ word: word, wordLength: word.length, scrambledLetters: scrambledLetters })
      }.bind(this))
    },

    getDictionaryLocally: function () {
      $.get('http://localhost:8080/words.txt', function(data) {
        var dictionary = {};
        data.toLowerCase().split('\n').forEach(function(word) {
          dictionary[word] = true;
        });
        this.setState({ dictionary: dictionary})
      }.bind(this))
    },

    handleKeyDown: function (event) {
      var asciiValue = event.keyCode;
      if (asciiValue == 13) {
        this.checkGuess()
      } else if (asciiValue >= 65 && asciiValue <= 90) {
        var letter = String.fromCharCode(event.keyCode).toLowerCase();
        this.guessNewLetter(letter)
        if (this.state.guess.length == this.state.word.length) {
          this.checkGuess()
        }
      }
    },

    guessNewLetter: function (letter) {
      this.setState({ guess: this.state.guess + letter });
      var scrambledLetters = this.state.scrambledLetters;
      for (var idx = this.state.guessIdx; idx < this.state.wordLength; idx++) {
        if (scrambledLetters[idx] === letter) {
          var newLetter = scrambledLetters[idx]
          var oldLetter = scrambledLetters[this.state.guessIdx]
          scrambledLetters[this.state.guessIdx] = newLetter;
          scrambledLetters[idx] = oldLetter;
          break;
        }
      }

      this.setState({ scrambledLetters: scrambledLetters, guessIdx: this.state.guessIdx + 1 })
      
      console.log(this.state.guess);
    },

    checkGuess: function () {
      if (this.state.word == this.state.guess) {
        console.log('correct guess')
      } else {
        console.log('wrong guess')
      }
      this.setState({ guess: '', guessIdx: 0 })
    },

    getInitialState: function () {
      return ({
        guess: '',
        guessIdx: 0,
        points: {
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
        },
        guess: ''
      })
    },

    findValue: function(word) {
      var total = 0;
      word.split('').forEach(function(char) {
        total += this.state.points[char];
      }.bind(this))
      return total;
    },

    scrambleWordtoLetters: function(word) {
      var length = word.length;
      var randIndices = []
      var seen = {}
      while (randIndices.length < length) {
        var rand = Math.floor(Math.random() * length)
        if (!seen[rand]) {
          seen[rand] = true;
          randIndices.push(rand)
        }
      }
      var output = randIndices.map(function(idx) {
        return word[idx];
      })

      return output;
    },

    displayLetter: function(letter) {
      return (
        <section className='letter-tiles'>
          <Tile
            letter={letter}
          />
        </section>
      )
    },

    render: function () {
      if (this.state.word) {
        var letters = this.state.scrambledLetters;
        var value = this.findValue(this.state.word);
      } else {
        var letters = [''];
        var value = 0;
      }
      return (
        <div>
          <section>
            {letters.map(this.displayLetter)}
          </section>
          <p>word: {this.state.word}</p>
          <p>value: {value}</p>
        </div>  
      )
    }
  });

  var Tile = React.createClass({
    render: function () {
      return (
        <div className='letter'>{this.props.letter}</div>
      )
    }
  })

  var render = function () {
    React.render(
      <WordScrambleApp
        url='http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=200000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
      />,
      document.getElementById('root')
    );
  };

  render()
})()
