'use strict';

var React = require('react');
var Utils = require('./utils.js');
var WordScrambleApp = require('./app.js')
var LeaderboardEntry = require('./leaderboardEntry.js')

module.exports = React.createClass({
  getInitialState: function () {
    return ({
      leaderboard: []
    })
  },

  componentWillMount: function () {
    this.setState({ leaderboard: Utils.leaderboard });
  },

  displayLeaderboard: function (entry, idx) {
    return (
      <LeaderboardEntry
      rank={idx + 1}
      name={entry.name}
      score={entry.score}
      wordsGuessed={entry.wordsGuessed}/>
    )
  },

  render: function () {
    return (
      <div>
        <div className='overlay'></div>
        <div className='score-modal clearfix'>
          <h2>Game Over!</h2>
          <p>You guessed <b>{this.props.wordsGuessed} words</b> for <b>{this.props.points} points</b></p>
          <p>The word was <b>{this.props.word}</b></p>
          <br />
          <a id='play-again' href='/word_scramble'>Play Again!</a>
          <br /><br /><br />
          <hr />
          <br />
          <table className='leaderboard'>
            <caption>Leaderboard</caption>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Words</th>
            {this.state.leaderboard.map(this.displayLeaderboard)}
          </table>
        </div>
      </div>
    )
  }
})