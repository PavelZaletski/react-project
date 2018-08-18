import * as Models from '../models';
import processDate from '../../shared/processDate';
import { saveImage, deleteImage, updateImage, genFileName, createPreview } from '../helpers/saveImage';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import Redux from 'redux';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import App from '../../shared/app';
import renderTemplate from '../routes/template';
import { createNewStore } from '../../shared/store';
import findAccount from '../helpers/findAccount';
import { findArticle, updateArticle } from '../helpers/findArticle';

export function index(req, res) {
	Models.Article.aggregate([
		{
			$lookup:
			{
				from: "accounts",
				localField: "author_id",
				foreignField: "_id",
				as: "author"
			}
		},
		{$unwind: "$author"},
		{
			$project: {
				publishedAt: 1,
				'author.firstname': 1,
				'author.lastname': 1,
				'author.username': 1,
				'author.urlToAvatar': 1,
				text: 1,
				uniqueId: 1,
				title: 1,
				urlToImage: 1,
				description: 1
			}
		},
		{$sort: {publishedAt: 1}}
	], (err, articles)=>{
		if (err) { 
			throw err;
		}

		if (articles) {
			res.json(articles);
		} else {
			res.json({error: 'not found'});
		}
	});
}

export function create(req, res) {
	if(!req.user){
		res.send(401, 'Unauthorized');
	}

	const { title, text, description } = req.body;

	var user = req.user;
	let file = req.files.file;

	// let p1 = findAccount(user.username);
	let p1 = saveImage(file);
	let p2 = createPreview(file);

	Promise.all([p1, p2]).then(values => {
		console.log(values);
		const { filename, width, height } = values[0];
		const preview = values[1];

		var newArticle = new Models.Article({
			text,
			title,
			description: description || text.slice(0, 50).replace(/\s+$/, '') + '...',
			author_uniqueId: user.username,
			urlToImage: filename,
			uniqueId: generateUniqueId(title),
			imageWidth: width,
			imageHeight: height,
			preview
		});

		newArticle.save(function(err, article) {
			if (err) { throw err; }
			res.json({
				text: article.text,
				title: article.title,
				author: {
					firstname: user.firstname,
					fullname: user.fullname,
					username: user.username,
					urlToAvatar: user.urlToAvatar
				},
				urlToImage: article.urlToImage,
				uniqueId: article.uniqueId,
				description: article.description,
				imageWidth: article.imageWidth,
				imageHeight: article.imageHeight
			})
		});
	});
}

export function reactRenderShow(req, res) {
	const _user = req.user || {};
	const user = {
		user: {
			firstname: _user.firstname || null,
			lastname: _user.lastname || null,
			username: _user.username || null,
			urlToAvatar: _user.urlToAvatar || null,
		},
		fetching: false,
		fetched: true,
		error: null
	};

	Models.Article.findArticles()
		.then((_articles) => {
			var articles = {
				articles: _articles,
				fetching: false,
				fetched: true,
				error: null
			};

			var initialState = { user, articles };
			const context = {};
			const store = createNewStore(initialState);

			const app = (
				<Provider store={store}>
					<StaticRouter location={'/article' + req.url} context={context}>
						<App />
					</StaticRouter>
				</Provider>
			)
			let html = ReactDOMServer.renderToString(app);
			let preloadedState = store.getState();
			html = renderTemplate(html, preloadedState);
			res.send(html);
		});
}

export function reactRenderEditArticle(req, res){
	const _user = req.user || {};
	const user = {
		user: {
			firstname: _user.firstname || null,
			lastname: _user.lastname || null,
			username: _user.username || null,
			urlToAvatar: _user.urlToAvatar || null,
		},
		fetching: false,
		fetched: true,
		error: null
	};

	Models.Article.aggregate([
		{
			$lookup:
				{
					from: "accounts",
					localField: "author_uniqueId",
					foreignField: "username",
					as: "author"
				}
		},
		{ $unwind: "$author" },
		{
			$project: {
				publishedAt: 1,
				'author.firstname': 1,
				'author.lastname': 1,
				'author.username': 1,
				'author.urlToAvatar': 1,
				text: 1,
				uniqueId: 1,
				title: 1,
				urlToImage: 1,
				description: 1
			}
		},
		{ $sort: { publishedAt: 1 } }
	], (err, _articles) => {
		if (err) {
			throw err;
		}

		if (_articles) {
			var articles = {
				articles: _articles,
				fetching: false,
				fetched: true,
				error: null
			};

			var initialState = { user, articles };
			const context = {};
			const store = createNewStore(initialState);

			const app = (
				<Provider store={store}>
					<StaticRouter location={'/article' + req.url} context={context}>
						<App />
					</StaticRouter>
				</Provider>
			)
			let html = ReactDOMServer.renderToString(app);
			let preloadedState = store.getState();
			html = renderTemplate(html, preloadedState);
			res.send(html);
		} else {
			res.json({ error: 'not found' });
		}
	});
}

export function del(req, res){
	if (!req.user) {
		res.send(401, 'Unauthorized');
	}

	let uniqueId = req.params.uniqueId;

	findArticle(uniqueId)
		.then((article) => {
			let p1 = deleteImage(article.urlToImage);
			let p2 = Models.Article.deleteArticle(uniqueId);

			Promise.all([p1, p2]).then(() => {
				res.json({
					status: 'success',
					uniqueId: req.params.uniqueId
				});
			});
		});
}

export function update(req, res){
	if(!req.user){
		res.send(401, 'Unauthorized');
	}

	const { text, description, title } = req.body;
	const uniqueId = req.params.uniqueId;
	let file = req.files && req.files.file;

	if (file) {
		findArticle(uniqueId)
			.then((article) => {
				let filename = genFileName(file);
				updateImage(file, filename, article.urlToImage)
					.then((filename) => {
						let p1 = updateArticle(uniqueId, { text, description, title, urlToImage: filename }).then((updatedArticle) => {
							let { text, description, title } = updatedArticle;
							let json = { text, description, title, urlToImage: filename, uniqueId };
		
							res.json(json);
						})
	
					});
			});
	} else {
		updateArticle(uniqueId, { text, description, title })
		.then(({ text, description, title }) => {
			res.json({ text, description, title, uniqueId });
		});
	}
}

export function reactRenderAddArticle(req, res){
	const _user = req.user || {};
	const user = {
		user: {
			firstname: _user.firstname || null,
			lastname: _user.lastname || null,
			username: _user.username || null,
			urlToAvatar: _user.urlToAvatar || null,
		},
		fetching: false,
		fetched: true,
		error: null
	};

	Models.Article.aggregate([
		{
			$lookup:
				{
					from: "accounts",
					localField: "author_id",
					foreignField: "_id",
					as: "author"
				}
		},
		{ $unwind: "$author" },
		{
			$project: {
				publishedAt: 1,
				'author.firstname': 1,
				'author.lastname': 1,
				'author.username': 1,
				'author.urlToAvatar': 1,
				text: 1,
				uniqueId: 1,
				title: 1,
				urlToImage: 1,
				description: 1
			}
		},
		{ $sort: { publishedAt: 1 } }
	], (err, _articles) => {
		if (err) {
			throw err;
		}

		if (_articles) {
			var articles = {
				articles: _articles,
				fetching: false,
				fetched: true,
				error: null
			};

			var initialState = { user, articles };
			const context = {};
			const store = createNewStore(initialState);

			const app = (
				<Provider store={store}>
					<StaticRouter location={'/article' + req.url} context={context}>
						<App />
					</StaticRouter>
				</Provider>
			)
			let html = ReactDOMServer.renderToString(app);
			let preloadedState = store.getState();
			html = renderTemplate(html, preloadedState);
			res.send(html);
		} else {
			res.json({ error: 'not found' });
		}
	});
}

function generateUniqueId(title){
	var t = title.replace(/\s*,\s*|\s+/g, '-').replace(/!+|\?+/, '');
	return t;
}