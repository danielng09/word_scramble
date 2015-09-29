'use strict';

var React = require('react');
var WordScrambleApp = require('./app.js')

module.exports = React.createClass({
  render: function () {
    return (
      <div>
        <div className='overlay'></div>
        <div className='score-modal clearfix'>
          <h2>Game Over!</h2>
          <p>You guessed <b>{this.props.wordsGuessed} words</b> for <b>{this.props.points} points</b></p>
          <p>The word was <b>{this.props.word}</b></p>
          <br /><br />
          <a id='play-again' href='/'>Play Again!</a>
          <div className='high-score'>
          </div>
        </div>
      </div>
    )
  }
})