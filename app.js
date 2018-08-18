import express from 'express';
import path from 'path';
// var favicon = require('serve-favicon');
import logger from  'morgan';
import cookieParser from  'cookie-parser';
import bodyParser from 'body-parser';
import passport from  'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import busboyBodyParser from 'busboy-body-parser';
mongoose.connect('mongodb://heroku_9xnpcngg:gtku3sh04lbqunq4uq5mtvbavr@ds127878.mlab.com:27878/heroku_9xnpcngg');

//Routers
import index from './server/routes/index';
import articleRouter from './server/routes/article';
import commentRouter from './server/routes/comment';
import imageRouter from './server/routes/image';
import passportConfig from  './server/configs/passportConfig';
import { Account } from './server/models/account';

const app = express();

// mongoose.connect('mongodb://localhost:27017/posts');
mongoose.connection.on('open', function() {
	console.log('Mongoose connected.');
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(busboyBodyParser({ limit: '5mb'}));

app.use(passportConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/article', articleRouter);
app.use('/comment', commentRouter);
app.use('/image', imageRouter);

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

/*======================================*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

export default app;