'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
	context: path.resolve(__dirname, 'source/js'),
	entry: ['webpack/hot/dev-server', './main'],
	output: {
		path: __dirname +  '/assets',
		filename: 'bundle.js',
		publicPath: '/assets/'
	},

	watch: false,

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: null,

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.ProvidePlugin({
			Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true
			}
		})
	],

	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.css']
	},

	resolveLoader: {
		modulesDirectories: ['node_modules'],
		moduleTemplates: ['*-loader'],
		extensions: ['', '.js', '.css']
	},

	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			loader: 'style!css!autoprefixer?browsers=last 4 version',
		},{
			test: /\.styl$/,
			loader: 'style!css!autoprefixer?browsers=last 4 version!stylus'
		}, {
			test: /\.(png|jpg)$/,
			loader: 'file?name=[path][name].[ext]'
		}]
	}
};
