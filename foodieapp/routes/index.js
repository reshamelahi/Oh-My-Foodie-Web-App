const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');

const mongoose = require('mongoose');
const User = mongoose.model("User");
const Link = mongoose.model("Link");
const List = mongoose.model('List');
const Restaurant = mongoose.model('Restaurant');
const Location = mongoose.model('Location');
const Comment = mongoose.model('Comment');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

/* GET home page. */
router.get('/', function(req, res) {
  if(isLoggedIn) {
    res.render('index', {user: req.user, title: 'Oh My Foodie!'});
  }
  res.render('index', {title: 'Oh My Foodie!'})
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

router.post('/userprofile', isLoggedIn, (req, res) => {
  req.user.save(function (err) {
    console.log("YOOO");
    if (err)return handleError(err);
      const l = new List({
        name: req.body.name,
        restaurants: [],
        user: req.user._id
      });
      l.save(function (err) {
        if (err) return handleError(err);
      });
  });
  List.findOne({name: req.body.name}).populate('user').exec(function(err, list) {
    console.log("I'M HERE");
    if (err) return handleError(err);
    res.send("The user is %s", list.user.username);
  });
  // const l = new List({
  //   name: req.body.name,
  //   restaurants: [],
  //   user: req.user._id
  // });
  // req.user.lists.push(l._id);
  // req.user.save(function(err) {
  //   if (err)
  //     throw err;
  // });
  // l.save((err, lists) => {
  //   if(err) {
  //     throw err;
  //   }
  // // l.save((err, lists) => {
  // //   if(err) {
  // //       res.render('userprofile', {user:req.user, lists:lists, err:err}); 
  // //   }
  // //   else { res.redirect('/userprofile'); }
  // });
  // User.findOne({user: req.user._id}).populate('lists').exec(function(err, list) {
  //   if(err) res.render('userprofile', {user:req.user, lists:lists, err:err}); 
  //   else res.redirect('/userprofile');

  // });
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
  List.findOneAndUpdate({slug: slugName}, {$push: {restaurants: new Restaurant ({name: req.body.name})}}, (err, lists) => {
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