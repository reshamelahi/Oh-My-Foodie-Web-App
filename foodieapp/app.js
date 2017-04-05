const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

require('./db');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
  res.render('error');
});

// homepage
app.get('/', (req, res) => {
  res.render('layout');
});

// goodeats
app.get('/', (req, res) => {
  res.render('foodRec');
});

// goodeats/create
app.get('/', (req, res) => {
  res.render('createRec');
});

// userprofile
app.get('/', (req, res) => {
  res.render('profile');
});

// userprofile/create
app.get('/', (req, res) => {
  res.render('createList');
});

// userprofile/list.:slug
app.get('/', (req, res) => {
  res.render('list');
});

// nomnomguru
app.get('/', (req, res) => {
  res.render('guruji');
});

// foodienetwork
app.get('/', (req, res) => {
  res.render('chatroom');
});

// restaurant/:slug
app.get('/', (req, res) => {
  res.render('place');
});

module.exports = app;
