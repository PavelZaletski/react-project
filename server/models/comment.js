import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import processDate from '../../shared/processDate';

const commentsSchema = new Schema({
	author_id: { type: ObjectId },
	article_id: { type: ObjectId },
	text: String,
	publishedAt: { type: Date, default: Date.now }
});

// commentsSchema.virtual('date').get(function() {
// 	return processDate(this.publishedAt);
// });

export const Comment =  mongoose.model('Comment', commentsSchema);