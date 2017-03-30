require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(3000);
