'use strict';

var React = require('react');

module.exports = React.createClass({
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