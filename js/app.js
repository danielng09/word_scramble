var React = require('react');
var $ = require('jquery')

var app = app || {};

(function () {
  // 'use strict';
  var Tile = app.Tile

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
        var word = data.word.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
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
      var guessIdx = this.state.guessIdx;
      for (var idx = this.state.guessIdx; idx < this.state.wordLength; idx++) {
        if (scrambledLetters[idx] === letter) {
          var newLetter = scrambledLetters[idx];
          var oldLetter = scrambledLetters[this.state.guessIdx];
          scrambledLetters[this.state.guessIdx] = newLetter;
          scrambledLetters[idx] = oldLetter;
          guessIdx += 1;
          break;
        }
      }

      this.setState({ scrambledLetters: scrambledLetters, guessIdx: guessIdx })
      
      console.log(this.state.guess);
    },

    checkGuess: function () {
      if (this.state.word == this.state.guess) {
        this.getWordFromWordNikAPI();
        var value = this.findValue(this.state.word);
        this.setState({ points: this.state.points + value })
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
        points: 0,
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
        guess: ''
      })
    },

    findValue: function(word) {
      var total = 0;
      word.split('').forEach(function(char) {
        total += this.state.pointValues[char];
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

    displayLetter: function(letter, idx) {
      var selected = false;
      if (idx <= this.state.guess.length - 1) {
        selected = true;
      }
      return (
        <section className='letter-tiles'>
          <Tile
            letter={letter}
            selected={selected}
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
          <section>
            <Footer
              points={this.state.points}
            />
          </section>
        </div>  
      )
    }
  });

  var Tile = React.createClass({
    render: function () {
      var style = 'letter'
      if (this.props.selected) {
        style += ' selected'
      }
      return (
        <div className={style}>{this.props.letter}</div>
      )
    }
  })

  var Footer = React.createClass({
    getInitialState: function () {
      return ({
        time: 60,
      })
    },

    render: function () {
      return (
        <span>Time: {this.state.time}s | Points: {this.props.points}</span>
      )
    },
  })

  var render = function () {
    React.render(
      <WordScrambleApp
        url='http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=400000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
      />,
      document.getElementById('root')
    );
  };

  render()
})()
