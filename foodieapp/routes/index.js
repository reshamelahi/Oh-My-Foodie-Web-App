const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Link = mongoose.model("Link");
const List = mongoose.model('List');
const Restaurant = mongoose.model('Restaurant');
const Location = mongoose.model('Location');

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
	});
	l.save((err, lists) => {
		if(err) {
			res.render('userprofile', {lists:lists, err:err}); 
		}
		else { 
			res.redirect('/userprofile'); 
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
    const latestComment = req.session.lastComment || '';
    if (req.query.button === "Vote") {
      Link.findOneAndUpdate({slug: req.params.slug}, {$inc: {votes: 1}}, (err, links) => {
        res.redirect("/foodienetwork");
      });
    }
		else { res.render('commentform', {links: links, 'lastComment': latestComment}); }
	});
});

router.post('/foodienetwork/:slug', (req, res) => {
  const slugVar = req.params.slug;
  Link.findOneAndUpdate({slug: slugVar}, {$push: {comments: {text: req.body.text, name:req.body.name}}}, (err, links) => {
    if(err) {
        res.render('commentform', {links:links, err:err}); 
    }
    else {
      req.session.lastComment = req.body.text;
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

router.get('/:slug', function(req, res) {
  Restaurant.findOne({slug: req.params.slug}, (err, restaurants) => {
    res.render('restaurant', {restaurants:restaurants, err:err});
  });
});

module.exports = router;
