var webpack = require('webpack'),
		path = require('path');

module.exports = {
	entry: {
		app: ['./src/js/index.js']
	},
	output: {
    path: path.join(__dirname),
    filename: 'bundle.js'
  },

	module: {
		loaders: [
			{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
		]
	},
	plugins: []
};
