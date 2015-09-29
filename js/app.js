'use strict';

var React = require('react');
var $ = require('jquery');
var Tile = require('./tile.js');
var Footer = require('./footer.js');
var ScoreModal = require('./scoreModal.js');

module.exports = React.createClass({
   getInitialState: function () {
      return ({
        availableLetters: [],
        guessedLetters: [],
        points: 0,
        wordsGuessed: 0,
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
      })
    },

    componentWillMount: function () {
      this.getWordFromWordNikAPI();
      this.getDictionaryLocally();
    },

    componentDidMount: function () {
      $(document.body).on('keydown', this.handleKeyDown);
    },

    componentDidUpdate: function () {
      if (this.state.word && 
          this.state.guessedLetters.length === this.state.word.length) {
        this.checkGuess() 
      } 
    },

    getWordFromWordNikAPI: function () {
      $.get(this.props.url, function(data) {
        var word = data.word.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
        var scrambledLetters = this.scrambleWordtoLetters(word)
        this.setState({ word: word, 
                        scrambledLetters: scrambledLetters, 
                        availableLetters: scrambledLetters
                      })
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
      event.preventDefault();
      var asciiValue = event.keyCode;
      if (asciiValue === 8) {
        this.removeGuessedLetter();
      } else if (asciiValue === 13) {
        this.checkGuess()
      } else if (asciiValue >= 65 && asciiValue <= 90) {
        var letter = String.fromCharCode(event.keyCode).toLowerCase();
        this.guessNewLetter(letter)
      }
    },

    removeGuessedLetter: function () {
      if (this.state.guessedLetters.length > 0) {
        var removedLetter = this.state.guessedLetters.splice(-1, 1)[0];
        this.state.availableLetters.push(removedLetter)
        this.setState({ guessedLetters: this.state.guessedLetters,
                        availableLetters: this.state.availableLetters,
                      })
      }
    },

    guessNewLetter: function (letter) {
      var matchedGuessIdx = this.hasElementInArray(this.state.availableLetters, letter)
      if (typeof matchedGuessIdx === 'number') {
        var guessedLetter = this.state.availableLetters.splice(matchedGuessIdx, 1)[0];
        this.state.guessedLetters.push(guessedLetter)
        this.setState({
          guessedLetters: this.state.guessedLetters,
          availableLetters: this.state.availableLetters

        })
      }

      console.log(this.state.guessedLetters.join(''));
    },

    hasElementInArray: function (array, ele) {
      for (var idx = 0; idx < array.length; idx++) {
        if (array[idx] === ele ) {
          return idx;
        }
      }
      return false;
    },

    checkGuess: function () {
      if (this.state.word === this.state.guessedLetters.join('')) {
        window.setTimeout(function () {
          var value = this.findValue(this.state.word);
          this.setState({ points: this.state.points + value, 
                          guessedLetters: [],
                          wordsGuessed: this.state.wordsGuessed + 1 })
          this.getWordFromWordNikAPI();
          console.log('correct guess')
        }.bind(this), 500)
      } else {
        var scrambledLetters = this.scrambleWordtoLetters(this.state.word);
        this.setState({ availableLetters: scrambledLetters, guessedLetters: [] })
        console.log('wrong guess')
      }
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

    handleOutOfTime: function () {
      React.render(<ScoreModal 
                    points={this.state.points}
                    wordsGuessed={this.state.wordsGuessed} 
                    word={this.state.word} />,
                    document.getElementById('gameOver'));
      $(document.body).off();
    },

    displayLetter: function(letter, idx) {
      var selected = false;
      if (idx < this.state.guessedLetters.length) {
        selected = true;
      }
      return (
          <Tile
            letter={letter}
            selected={selected} />
      )
    },

    render: function () {
      var letters = this.state.guessedLetters.concat(this.state.availableLetters)

      console.log(this.state.word)
      return (
        <div>
          <div id='end-game'>
          </div>
          <div class='tiles'>
            {letters.map(this.displayLetter)}
          </div>
          <br /><br /><br /><br />
          <p /><p />
          <br />
          <section>
            <Footer
              points={this.state.points}
              handleOutOfTime={this.handleOutOfTime}
            />
          </section>
        </div>
      )
    }
  });