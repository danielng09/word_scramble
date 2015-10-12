'use strict';

var React = require('react');
var Firebase = require('firebase');
var firebaseURL = 'word-scramble.firebaseIO.com';

var LeaderboardEntry = require('./leaderboardEntry.js');

module.exports = React.createClass({
  getInitialState: function () {
    return ({
      leaderboard: []
    });
  },

  componentWillMount: function () {
    this.getLeaderboard(this.handleScore);
  },

  componentDidMount: function () {
    this.setState({ isFirstRender: false });
  },

  getLeaderboard: function (callback) {
    this._firebase = new Firebase(firebaseURL);
    this._firebase.once('value', function(data) {
      var obj = data.val().leaderboard;
      if (!obj) {
        return;
      }

      var items = [];
      for (var id in obj) {
        if (obj.hasOwnProperty(id)) {
          items.push(obj[id]);
        }
      }

      this.setState({ leaderboard: items });
      callback();

    }.bind(this));
  },

  handleScore: function () {
    var index = this.checkIfHighScore();
    this.setState({ index: index });
    if (typeof this.state.index === 'number') {
      this.shiftScoresDown(index);
    }
  },

  checkIfHighScore: function () {
    let length = this.state.leaderboard.length;
    for (var idx = 0; idx < length; idx ++) {
      if (this.props.points >= this.state.leaderboard[idx].score) {
        return idx;
      }
    }
    return false;
  },

  shiftScoresDown: function (index) {
    var leaderboard = this.state.leaderboard;
    var entry = { name: 'Guest',
                  score: this.props.points,
                  wordsGuessed: this.props.wordsGuessed
                };
    leaderboard = leaderboard.splice(0, index).concat(entry, leaderboard);
    this.setState({ leaderboard: leaderboard });
    console.log('finish shifting scores down');
  },

  handleSubmitHighScore: function(name, index) {
    var leaderboard = this.state.leaderboard;
    leaderboard[index].name = name;
    this.setState({ leaderboard: leaderboard, index: false });
    this._firebase.child('leaderboard').set(this.state.leaderboard);
  },

  displayLeaderboard: function (entry, idx) {
    var hasEditView = this.state.index === idx ? true : false;
    return (
      <LeaderboardEntry
      key={idx}
      index={idx}
      name={entry.name}
      score={entry.score}
      wordsGuessed={entry.wordsGuessed}
      hasEditView={hasEditView}
      handleSubmitHighScore={this.handleSubmitHighScore}/>
    )
  },

  render: function () {
    console.log('rendering leaderboard');
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
