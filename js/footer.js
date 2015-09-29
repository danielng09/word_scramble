'use strict';

var React = require('react');
 
module.exports = React.createClass({
  getInitialState: function () {
    return ({
      timeLeft: 60
    })
  },

  startTimer: function () {
    this.interval = setInterval(this.tick, 1000);
  },

  tick: function () {
    this.setState({ timeLeft: this.state.timeLeft - 1});
    if (this.state.timeLeft <= 0) {
      clearInterval(this.interval)
      this.props.handleOutOfTime()
    }
  },

  componentDidMount: function () {
    this.startTimer();
  },

  componentWillUnmount: function () {
    clearInterval(this.interval)
  },

  render: function () {
    return (
      <span className='footer'>Time: {this.state.timeLeft}s | Points: {this.props.points}</span>
    )
  },
})