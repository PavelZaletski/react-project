'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import processDate from '../../shared/processDate';

const articleSchema = new Schema({
	title:  String,
	author_uniqueId: String,
	description: String,
	text:   String,
	publishedAt: { type: Date, default: Date.now },
	likes: { type: Number, 'default': 0 },
	views: { type: Number, 'default': 0 },
	urlToImage: String,
	uniqueId: {type: String, index: true},
	imageWidth: { type: Number, 'default': 0 },
	imageHeight: { type: Number, 'default': 0 },
	preview: String
});

// articleSchema.virtual('description').get(function() {
// 	return this.text.slice(0, 50).replace(/\s+$/, '') + '...';
// });

articleSchema.virtual('date').get(function() {
	return processDate(this.publishedAt);
});

articleSchema.statics.findArticles = function () {
	return new Promise((resolve, reject) => {
		return this.model('Article').aggregate([
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
					description: 1,
					imageWidth: 1,
					imageHeight: 1,
					preview: 1
				}
			},
			{ $sort: { publishedAt: 1 } }
		], function(err, articles) {
			if (err) {
				throw err;
			}

			if (articles) {
				resolve(articles);
			} else {
				reject();
			}
		});
	});
};

articleSchema.statics.deleteArticle = function(uniqueId) {
	return new Promise((resolve, reject) => {
		this.model('Article').remove({ uniqueId }, function (err) {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	});
}

export const Article = mongoose.model('Article', articleSchema);