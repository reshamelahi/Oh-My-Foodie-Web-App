require('./db');

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

hbs.registerHelper('humanize', function(date) {
    var hum = new Humanize(date);
    return hum.humanizeDate();
});

hbs.registerHelper('isEqual', function(obj1, obj2) {
    return obj1.equals(obj2);
});

hbs.registerHelper('countComments', function(com) {
    return com.length;
})

// bootstrap middleware config
require('./middleware')(app, passport);

// bootstrap passport config
require('./passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: '5c99869a7ec9090ff67044df4a7f6d663259660d853fa5523df3d73e3759b3b99f9481a7c6ea75289525c778465dfd3382f9b09179695380c2353f8f3f8df44f',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

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
