require('./db');
require('./auth');

const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: '5c99869a7ec9090ff67044df4a7f6d663259660d853fa5523df3d73e3759b3b99f9481a7c6ea75289525c778465dfd3382f9b09179695380c2353f8f3f8df44f',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(morgan('dev'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// NOTE: initialize passport and let it know that we're enabling sessions
app.use(passport.initialize());
require('./passport')(passport);
app.use(passport.session());
// END

// NOTE: add some middleware that drops req.user into the context of
// every template
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});
// END

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.status(404);
    res.render('error');
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

module.exports = app;