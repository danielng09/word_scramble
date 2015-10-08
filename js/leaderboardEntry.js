'use strict';

var React = require('react')

module.exports = React.createClass({
	getInitialState: function () {
		return (
			{ name: this.props.name }
		)
	},

	handleNameEdit: function (event) {
		var name = event.target.value;
		this.setState({ name: name })
	},

	handleSubmit: function (event) {
		event.preventDefault();
		this.props.firebaseRefToRank.set({
			name: this.state.name,
     	score: this.props.score,
     	wordsGuessed: this.props.wordsGuessed
		})
		this.props.removeRankIndex();
	},

	render: function () {
		var style;
		if (this.props.hasEditView) {
			var style = 'editing';
		}
		return(
			<tr>
				<td>{this.props.rank}</td>
				<td className={style}>
					<div className='view'>
						{this.state.name}
					</div>
					<form onSubmit={this.handleSubmit}>
						<input
							refs='editField'
							className='edit'
							value={this.state.name}
							onChange={this.handleNameEdit}
						>
						</input>
					</form>
				</td>
				<td>{this.props.score}</td>
				<td>{this.props.wordsGuessed}</td>
			</tr>
		)
	},
})