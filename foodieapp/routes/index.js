const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Link = mongoose.model("Link");
const List = mongoose.model('List');
const Restaurant = mongoose.model('Restaurant');
const Location = mongoose.model('Location');
const Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Oh My Foodie!' });
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
    res.render('addToList');
  });
});

router.post('/list/:slug', (req, res) => {
  const slugName = req.params.slug;
  List.findOneAndUpdate({slug: slugName}, {$push: {restaurants: {name: req.body.name}}}, (err, lists) => {
    if (err) {
      res.render('addToList' + slugName, {lists: lists, err: err});
    }
    else {
      res.redirect("/" + slugName);
    }
    });
});

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

router.get('/res/:slug', function(req, res) {
  Restaurant.findOne({slug: req.params.slug}, (err, restaurants) => {
    res.render('restaurant', {restaurants:restaurants, err:err});
  });
});

module.exports = router;
