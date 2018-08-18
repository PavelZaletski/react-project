'use strict';

const webpack = require('webpack');
const NODE_ENV = 'development';
const path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractLESS = new ExtractTextPlugin('style.css');

module.exports = {
	context: path.resolve(__dirname, 'client/'),
	entry: ['webpack/hot/dev-server', './main'],
	output: {
		path: __dirname +  '/public/assets',
		filename: 'bundle.js',
		publicPath: '/public/assets/'
	},

	watch: true,

	watchOptions: {
		aggregateTimeout: 100
	},

	devtool: 'inline-source-map',

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		}),
		new webpack.ProvidePlugin({
			Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise'
		}),
		new webpack.HotModuleReplacementPlugin(),
		// extractCSS,
		extractLESS,
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true
			}
		})
	],

	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.css']
	},

	resolveLoader: {
		modules: ['node_modules'],
		// moduleTemplates: ['*-loader'],
		extensions: ['.js', '.css', 'jsx']
	},

	module: {
		rules: [
			// {
			// 	test: /\.css$/,
			// 	use: extractCSS.extract(['css-loader', 'postcss-loader'])
			// },
			{
				test: /\.styl$/i,
				use: extractLESS.extract(['css-loader', 'stylus-loader'])
			},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
			
		},
		// {
		// 	test: /\.styl$/,
		// 	use: [
		// 		'style-loader',
		// 		'css-loader',
		// 		'stylus-loader'
		// 	]
		// }, 
		{
			test: /\.(png|jpg)$/,
			loader: 'file-loader?name=[path][name].[ext]'
		}, {
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
			},
			
			// query: {
			// 	presets: ['react', 'es2015'],
			// 	plugins: ['transform-decorators-legacy']
			// }
		}]
	},

	// webpackMiddleware: { stats: 'errors-only', noInfo: true },

	devServer: {
		host: 'localhost',
		port: 8080,
		hot: true
	}
};