'use strict';

var React = require('react');
var Firebase = require('firebase');
const firebaseURL = 'word-scramble.firebaseIO.com';

var Utils = require('./utils.js');
var WordScrambleApp = require('./app.js')
var LeaderboardEntry = require('./leaderboardEntry.js')

module.exports = React.createClass({
  getInitialState: function () {
    return ({
      leaderboard: [], leaderboardLoaded: false
    })
  },

  componentWillMount: function () {
    this.getLeaderboard(this.handleScore);
  },

  handleScore: function () {
    console.log('handling the score');
    var rankIndex = this.checkIfHighScore();
    if (typeof rankIndex === 'number') {
      this.insertNewScore(rankIndex);
    }
  },

  checkIfHighScore: function () {
    var idx = 0;
    for (var idx = 0; idx < 10; idx ++) {
      if (this.state.leaderboard[idx] === undefined || 
          this.props.points > this.state.leaderboard[idx].score) {
        return idx;
      }
    }
    return false;
  },

  insertNewScore: function (rank) {
    this._firebase.child('leaderboard')
                  .child(rank + 1)
                  .set({name: 'Guest', 
                        score: this.props.points, 
                        wordsGuessed: this.props.wordsGuessed
                      });
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

  getLeaderboard: function (callback) {
    console.log('getting leaderboard')
    this._firebase = new Firebase(firebaseURL)
    this._firebase.on('value', function(data) {
      console.log('hitting firebase')
      var obj = data.val().leaderboard;
      if (!obj) {
        return;
      }

      var items = [];
      for (var id in obj) {
        if (obj.hasOwnProperty(id)) {
          items.push(obj[id])
        }
      }

      this.setState({ leaderboard: items });

      if (!this.state.leaderboardLoaded) {
        this.setState({ leaderboardLoaded: true });
        callback();
      }
    }.bind(this))
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