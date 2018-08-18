import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const AccountSchema = new Schema({
	username: String,
	password: String,
	firstname: String,
	lastname: String,
	urlToAvatar: String
});

AccountSchema.plugin(passportLocalMongoose);

AccountSchema.virtual('fullname').get(function() {
	return this.firstname + ' ' + this.lastname;
});

export const Account = mongoose.model('Account', AccountSchema);