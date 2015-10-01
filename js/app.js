'use strict';

var React = require('react');


var $ = require('jquery');
var Tile = require('./tile.js');
var Footer = require('./footer.js');
var ScoreModal = require('./scoreModal.js');
window.Utils = require('./utils.js');
var $l = require('./jquery_lite.js');

module.exports = React.createClass({
  getInitialState: function () {
    return ({
      availableLetters: [],
      guessedLetters: [],
      points: 0,
      wordsGuessed: 0
    })
  },

  componentWillMount: function () {
    Utils.getDictionary();
    this.getWordFromWordNikAPI();
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
    // var options = {
    //   url: "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=500000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=7&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
    //   success: function(data) {
    //     var word = data.word.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
    //     var scrambledLetters = this.scrambleWordtoLetters(word)
    //     this.setState({ word: word, 
    //                     scrambledLetters: scrambledLetters, 
    //                     availableLetters: scrambledLetters
    //                   })
    //   }.bind(this)
    // };

    // $l.ajax(options)

    $.get(Utils.WORDNIKURL, function(response) {
      var word = response.word.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
      var scrambledLetters = this.scrambleWordtoLetters(word)
      this.setState({ word: word, 
                      scrambledLetters: scrambledLetters, 
                      availableLetters: scrambledLetters
                    })
      }.bind(this)
    )
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
    var matchedGuessIdx = Utils.hasElementInArray(this.state.availableLetters, letter)
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

  checkGuess: function () {
    if (this.state.word === this.state.guessedLetters.join('')) {
      window.setTimeout(function () {
        var value = Utils.calculateValue(this.state.word);
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
        <div className='tiles'>
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