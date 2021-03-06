const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const User = mongoose.model("User");
const Link = mongoose.model("Link");
const List = mongoose.model('List');
const Restaurant = mongoose.model('Restaurant');
const Comment = mongoose.model('Comment');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Oh My Foodie!'});
});

router.post('/', function(req, res) {
  let resFilter = {},
    searchExists = false;
  if(req.body.search) {
    resFilter.name = req.body.search; 
    searchExists = true;
  }

  Restaurant.find({}, (err, restaurants) => {
    console.log(restaurants);
    if (searchExists) {
      restaurants = restaurants.filter(function(restaurant) {
        if (restaurant.name === req.body.search) {
          res.redirect('/res/' + restaurant.slug);
        }
      });
    }
    else {
      const message = "Restaurant not found.";
      res.render('index', {title: 'Oh My Foodie!', message: message});
    }
  });
});

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  router.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
      res.render('login', { message: req.flash('loginMessage') }); 
  });

 // process the login form
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/userprofile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
 
  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  router.get('/register', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('register', {message: req.flash('registerMessage')});
  });

  router.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/userprofile', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)

/* userprofile */
router.get('/userprofile', isLoggedIn, function(req, res) {
    List.find({}, (err, lists) => {
      res.render('userprofile', {user: req.user, lists: lists, err:err});
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

  // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/userprofile',
            failureRedirect : '/'
        }));

  // =====================================
  // LOGOUT ==============================
  // =====================================
  router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
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
  List.findOneAndUpdate({slug: slugName}, {$push: {restaurants: new Restaurant({name: req.body.name})}}, (err, lists) => {
    if (err) {
      res.render('addToList', {lists: lists, err: err});
    }
    else {
      res.redirect("/list/" + req.params.slug);
    }
  });
});

// -------------------------------------------------------------------------------

// nomnomguru
router.get('/nomnomguru', isLoggedIn, (req, res) => {
  Comment.find({}, (err, comments) => {
    res.render('nomnomguru', {comments: comments, user: req.user});
  });
});

router.post('/nomnomguru', isLoggedIn, (req, res) => {
  const c = new Comment({
    name: req.user.username,
    text: req.body.text 
  });
  c.save((err, lists) => {
    if(err) {
      res.render('nomnomguru', {user: req.user, comments:comments, err:err}); 
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
  });
  l.save((err, links) => {
    if(err) {
        res.render('linksform', {links:links, err:err}); 
    }
    else { res.redirect('/foodienetwork'); }
  });
});

router.get('/foodienetwork/:slug', isLoggedIn, function(req, res) {
	Link.findOne({slug: req.params.slug}, (err, links) => {
    res.render('commentform', {links: links, user: req.user});
	});
});

router.post('/foodienetwork/:slug', isLoggedIn, (req, res) => {
  const slugVar = req.params.slug;
  Link.findOneAndUpdate({slug: slugVar}, {$push: {comments: {text: req.body.text, name: req.user.username}}}, (err, links) => {
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
  if (req.body.name && req.body.description && req.body.type) {
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
      else { res.redirect('/goodeats'); 
    }
  });
}
  if (req.body.filterType) {
    Restaurant.find({}, (err, restaurants) => {
      restaurants = restaurants.filter(function(x) {
        for (i = 0; i < x.type.length; i++) { 
          if (x.type[i] === req.body.filterType) {
            return true;
          }
        }
      });
      res.render('goodeats', {restaurants: restaurants, err:err});
    });
  }
  else {
    Restaurant.find({}, (err, restaurants) => {
      res.render('goodeats', {restaurants: restaurants});
    });
  }
});

// -------------------------------------------------------------------------------

/* slug for restaurant pages */
router.get('/res/:slug', function(req, res) {
  Restaurant.findOne({slug: req.params.slug}, (err, restaurants) => {
    if (req.query.button === "Upvote This Restaurant") {
      Restaurant.findOneAndUpdate({slug: req.params.slug}, {$inc: {upvotes: 1}}, (err, restaurants) => {
        res.redirect("/goodeats");
      });
    }
    else { res.render('restaurant', {restaurants:restaurants, err:err}); }
  });
});

module.exports = router;