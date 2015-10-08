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

  getLeaderboard: function (callback) {
    this._firebase = new Firebase(firebaseURL)
    this._firebase.on('value', function(data) {
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

  handleScore: function () {
    var rankIndex = this.checkIfHighScore();
    this.setState({ rankIndex: rankIndex })
    if (typeof this.state.rankIndex === 'number') {
      this.shiftScoresDown(rankIndex);
      this.insertNewScore(rankIndex);
    } 
  },

  checkIfHighScore: function () {
    var idx = 0;
    for (var idx = 0; idx < 10; idx ++) {
      if (this.state.leaderboard[idx] === undefined || 
          this.props.points >= this.state.leaderboard[idx].score) {
        return idx;
      }
    }
    return false;
  },

  insertNewScore: function (rankIndex) {
    var entry = { name: 'Guest', 
                  score: this.props.points, 
                  wordsGuessed: this.props.wordsGuessed
                };
    this._firebase.child('leaderboard')
                  .child(rankIndex + 1)
                  .set(entry);
    this.state.leaderboard[rankIndex] = entry;
    this.setState({ leaderboard: this.state.leaderboard })
  },

  shiftScoresDown: function (rankIndex) {
    var idx = Math.min(this.state.leaderboard.length, 9);

    for (; idx > rankIndex; idx--) {
      var entry = this.state.leaderboard[idx - 1];
      this._firebase.child('leaderboard')
                     .child(idx + 1)
                     .set({name: entry.name,
                           score: entry.score,
                           wordsGuessed: entry.wordsGuessed
                          })
    }
    console.log('finish shifting scores down');
  },

  removeRankIndex: function () {
    this.setState({ rankIndex: false });
  },

  displayLeaderboard: function (entry, idx) {
    var hasEditView = false;
    if (typeof this.state.rankIndex === 'number' && this.state.rankIndex === idx) {
      hasEditView = true;
    }
    return (
      <LeaderboardEntry
      rank={idx + 1}
      name={entry.name}
      score={entry.score}
      wordsGuessed={entry.wordsGuessed}
      hasEditView={hasEditView}
      firebaseRefToRank={this._firebase.child('leaderboard').child(idx + 1)}
      removeRankIndex={this.removeRankIndex}/>
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