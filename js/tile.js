var app = app || {};
var React = require('react');

(function () {
	'use strict';

	app.Tile = React.createClass({
		render: function () {
			return (
				<button>{this.props.letter}</button>
			)
		}
	})
})();

module.exports = app.Tile;