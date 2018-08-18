import fs from 'fs';
import path from 'path';
import * as Models from '../models';
import passport from 'passport';
import processDate from '../../shared/processDate';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import Redux from 'redux';
import { Provider } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import App from '../../shared/app';
import renderTemplate from '../routes/template';
import { createNewStore, getStore } from '../../shared/store';
import { saveAvatar, deleteImage } from '../helpers/saveImage';

export function reactRender(req, res){
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
				description: 1,
				imageWidth: 1,
				imageHeight: 1,
				preview: 1
			}
		},
		{$sort: {publishedAt: 1}}
	], (err, _articles)=>{
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

			var initialState =  {user, articles};
			const context = {};
			const store = createNewStore(initialState);

			const app = (
				<Provider store={store}>
					<StaticRouter location={req.url} context={context}>
						<App />
					</StaticRouter>
				</Provider>
			)
			let html = ReactDOMServer.renderToString(app);
			let preloadedState = store.getState();
			html = renderTemplate(html, preloadedState);
			res.send(html);
		} else {
			res.json({error: 'not found'});
		}
	});
}

export function reactRenderLogin(req, res) {
	const _user = req.user || {};
	const user = {
		user: {},
		fetching: false,
		fetched: true,
		error: null
	};

	var articles = {
		articles: [],
		fetching: false,
		fetched: true,
		error: null
	};

	var initialState = { user, articles };
	const context = {};
	const store = createNewStore(initialState);

	const app = (
		<Provider store={store}>
			<StaticRouter location={req.url} context={context}>
				<App />
			</StaticRouter>
		</Provider>
	)
	let html = ReactDOMServer.renderToString(app);
	let preloadedState = store.getState();
	html = renderTemplate(html, preloadedState);
	res.send(html);
}

export function reactRenderCreateAccount(req, res) {
	const _user = req.user || {};
	const user = {
		user: {},
		fetching: false,
		fetched: true,
		error: null
	};

	const articles = {
		articles: [],
		fetching: false,
		fetched: true,
		error: null
	};

	const initialState = { user, articles };
	const context = {};
	const store = createNewStore(initialState);

	const app = (
		<Provider store={store}>
			<StaticRouter location={req.url} context={context}>
				<App />
			</StaticRouter>
		</Provider>
	);

	let html = ReactDOMServer.renderToString(app);
	const preloadedState = store.getState();
	html = renderTemplate(html, preloadedState);
	res.send(html);
}

export function login(req, res) {
	const user= req.user;
	
	if(user){
		res.json({
			username: user.username,
			urlToAvatar: user.urlToAvatar,
			firstname: user.firstname,
			lastname: user.lastname,
			isAuthorized: true
		})
	}
}

export function check(req, res){
	var obj;
	const user = req.user;
	if(user){
		obj = {
			isAuthorized: true,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			urlToAvatar: user.urlToAvatar,
		}
	} else {
		obj = {
			isAuthorized: false
		}
	}
	
	res.json(obj);
}

export function logout(req, res) {
	req.logout();
	res.json({
		status: 'success'
	})
}

export function createAccount(req, res) {
	saveAvatar(req.files.file).then((filename) => {
		const { username, firstname, lastname } = req.body;
		Models.Account.register(new Models.Account(
			{
				username: req.body.username,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				urlToAvatar: filename
			}),
			req.body.password,
			function (err, account) {
				if (err) {
					throw err;
				}

				res.json({
					isAuthorized: true,
					username: account.username,
					firstname: account.firstname,
					lastname: account.lastname,
					urlToAvatar: filename,
				});
			}
		);
	});
}

