const express = require('express');
const router = express.Router();
const passport = require('passport');

const mongoose = require('mongoose');
const User = mongoose.model("User");
const Link = mongoose.model("Link");
const List = mongoose.model('List');
const Restaurant = mongoose.model('Restaurant');
const Location = mongoose.model('Location');
const Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Oh My Foodie!' });
});

router.post('/', function(req, res) {
  var resFilter = {},
    searchExists = false;
  console.log(req.body.search);
  if(req.body.search) {
    resFilter.name = req.body.search; 
    searchExists = true;
  }
 
  Restaurant.findOne(resFilter, function(err, restaurant) {
    console.log(restaurant);
    if (searchExists) {
      if (restaurant) {
        res.redirect('/res/' + restaurant.slug);
      }
    }
    else {
      const message = "Restaurant not found."
      res.render('index', {title: 'Oh My Foodie!', message: message});
    }
    //res.render('restaurant', {'restaurants': restaurants, searchExists: searchExists, restaurant: req.query.search });
  });
});

// -------------------------------------------------------------------------------

/* login and registration */
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  passport.authenticate('local', function(err,user) {
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
  // NOTE: notice that this form of authenticate returns a function that
  // we call immediately! See custom callback section of docs:
  // http://passportjs.org/guide/authenticate/
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      // NOTE: error? send message back to registration...
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      // NOTE: once you've registered, you should be logged in automatically
      // ...so call authenticate if there's no error
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

// -------------------------------------------------------------------------------

/* userprofile/createlist */
router.get('/userprofile', (req, res) => {
  List.find({}, (err, lists) => {
    res.render('userprofile', {lists: lists});
  });
});

router.post('/userprofile', (req, res) => {
  const l = new List({
    name: req.body.name,
    restaurants: []
  });
  l.save((err, lists) => {
    if(err) {
        res.render('userprofile', {lists:lists, err:err}); 
    }
    else { res.redirect('/userprofile'); }
  });
});

// -------------------------------------------------------------------------------

// list page with slug
router.get('/list/:slug', (req, res) => {
  List.findOne({slug: req.params.slug}, (err, lists) => {
    res.render('addToList', {lists:lists, err:err});
  });
});

router.post('/list/:slug', (req, res) => {
  const slugName = req.params.slug;
  List.findOneAndUpdate({slug: slugName}, {$push: {restaurants: new Restaurant ({name: req.body.name})}}, (err, lists) => {
    if (err) {
      res.render('addToList', {lists: lists, err: err});
    }
    else {
      res.redirect("/list/" + req.params.slug);
      console.log(req.params.slug);
    }
  });
});

// -------------------------------------------------------------------------------

// nomnomguru
router.get('/nomnomguru', (req, res) => {
  Comment.find({}, (err, comments) => {
    res.render('nomnomguru', {comments: comments});
  });
});

router.post('/nomnomguru', (req, res) => {
  const c = new Comment({
    name: req.body.name,
    text: req.body.text 
  });
  c.save((err, lists) => {
    if(err) {
      res.render('nomnomguru', {comments:comments, err:err}); 
    }
    else { 
      res.redirect('/nomnomguru'); 
    }
  });
});

// -------------------------------------------------------------------------------

/* foodienetwork */
router.get('/foodienetwork', (req, res) => {
	Link.find({}, (err, links) => {
		res.render('linksform', {links: links});
	});
});

router.post('/foodienetwork', (req, res) => {
  const l = new Link({
    url: req.body.url, 
    title: req.body.title,
    votes: 0
  });
  l.save((err, links) => {
    if(err) {
        res.render('linksform', {links:links, err:err}); 
    }
    else { res.redirect('/foodienetwork'); }
  });
});

router.get('/foodienetwork/:slug', function(req, res) {
	Link.findOne({slug: req.params.slug}, (err, links) => {
    if (req.query.button === "Vote") {
      Link.findOneAndUpdate({slug: req.params.slug}, {$inc: {votes: 1}}, (err, links) => {
        res.redirect("/foodienetwork");
      });
    }
		else { res.render('commentform', {links: links}); }
	});
});

router.post('/foodienetwork/:slug', (req, res) => {
  const slugVar = req.params.slug;
  Link.findOneAndUpdate({slug: slugVar}, {$push: {comments: {text: req.body.text, name: req.body.name}}}, (err, links) => {
    if(err) {
        res.render('commentform', {links:links, err:err}); 
    }
    else {
      res.redirect('/foodienetwork/' + slugVar);
    }
  });
});

// -------------------------------------------------------------------------------

/* goodeats */
router.get('/goodeats', (req, res) => {
  Restaurant.find({}, (err, restaurants) => {
    res.render('goodeats', {restaurants: restaurants});
  });
});

router.post('/goodeats', (req, res) => {
  const r = new Restaurant({
    name: req.body.name, 
    description: req.body.description,
    type: req.body.type,
    priceRange: req.body.price,
    upvotes: 0
  });
  r.save((err, restaurants) => {
    if(err) {
        res.render('goodeats', {restaurants:restaurants, err:err}); 
    }
    else { res.redirect('/goodeats'); }
  });
});

// -------------------------------------------------------------------------------

/* slug for restaurant pages */
router.get('/res/:slug', function(req, res) {
  Restaurant.findOne({slug: req.params.slug}, (err, restaurants, count) => {
    res.render('restaurant', {restaurants:restaurants, err:err});
  });
});

module.exports = router;
