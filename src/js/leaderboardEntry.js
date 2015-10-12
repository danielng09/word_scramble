'use strict';

var React = require('react');

module.exports = React.createClass({
	handleSubmit: function (event) {
		event.preventDefault();
		var name = this.refs.nameField.getDOMNode().value;
		this.props.handleSubmitHighScore(name, this.props.index)
	},

	componentDidUpdate: function () {
		this.refs.nameField.getDOMNode().value = this.props.name;
		this.refs.nameField.getDOMNode().focus();
	},

	render: function () {
		var style = this.props.hasEditView ? 'editing' : undefined;
		return(
			<tr>
				<td>{this.props.index + 1}</td>
				<td className={style}>
					<div className='view'>
						{this.props.name}
					</div>
					<form onSubmit={this.handleSubmit}>
						<input
							ref='nameField'
							className='edit'
							defaultValue={this.props.name}/>
					</form>
				</td>
				<td>{this.props.score}</td>
				<td>{this.props.wordsGuessed}</td>
			</tr>
		)
	},
})
