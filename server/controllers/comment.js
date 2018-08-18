'use strict';

import fs from 'fs';
import path from 'path';
import * as Models from '../models';
import processDate from '../../shared/processDate';

export function create(req, res) {
	if(!req.user){
		res.redirect('/');
	}

	Models.Article.findOne({uniqueId: req.body.articleUniqueId}, function(err, article) {
		if (err) { 
			throw err;
		}

		if (article) {
			Models.Account.findOne({username: req.user.username}, function(err, account) {
				if (err) { 
					throw err;
				}

				if(account){
					let date = Date.now();

					var newComment = new Models.Comment({
						article_id: article._id,
						author_id: account._id,
						text: req.body.text,
						publishedAt: date
					});

					newComment.save(function(err, comment) {
						if (err) { throw err; }
						res.json({
							status: 'success',
							author: account,
							publishedAt: comment.publishedAt,
							text: comment.text,
							urlToAvatar: req.user.urlToAvatar
						});
					});
				} else {
					res.json({status: 'error', error: 'account not found'});
				}
			});
		} else {
			res.json({status: 'error', error: 'article not found'});
		}
	});
}

export function get(req, res){
	const uniqueId = req.params.uniqueId;

	Models.Article.findOne({ uniqueId: { $regex: req.params.uniqueId } }, function (err, article) {
		if (err) { throw err; }

		if (article) {
			Models.Comment.aggregate([
				{ "$match": { "article_id": article._id } },
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
						_id: 0,
						publishedAt: 1,
						'author.firstname': 1,
						'author.lastname': 1,
						'author.username': 1,
						'author.urlToAvatar': 1,
						text: 1
					}
				},
				{ $sort: { publishedAt: 1 } }
			], function (err, comments) {
				if (err) { throw err; }

				for (let i = 0; i < comments.length; i++) {
					let comment = comments[i];
					comment.date = processDate(comment.publishedAt);
				}

				res.json({comments, uniqueId});
			});
		} else {
			res.json({status: 'error'});
		}
	});
}
