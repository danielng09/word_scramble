'use strict';

var React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    return ({
      timeLeft: 60
    });
  },

  startTimer: function () {
    this.interval = setInterval(this.tick, 1000);
  },

  tick: function () {
    this.setState({ timeLeft: this.state.timeLeft - 1});
    if (this.state.timeLeft <= 0) {
      clearInterval(this.interval);
      this.props.handleOutOfTime();
    }
  },

  componentDidMount: function () {
    this.startTimer();
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },

  render: function () {
    return (
      <div className='footer'>
        <div className='footer-ele'>Time: {this.state.timeLeft}s</div>|
        <div className='footer-ele'>Points: {this.props.points}</div>|
        <div className='footer-ele'>Words: {this.props.wordsGuessed}</div>
      </div>
    )
  },
})
