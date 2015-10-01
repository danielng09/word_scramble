'use strict';

var React = require('react')

module.exports = React.createClass({
	render: function () {
		return(
			<tr>
				<td>{this.props.rank}</td>
				<td>{this.props.name}</td>
				<td>{this.props.score}</td>
				<td>{this.props.wordsGuessed}</td>
			</tr>
		)
	},
})