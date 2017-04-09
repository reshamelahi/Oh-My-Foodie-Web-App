var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const List = mongoose.model('List');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Oh My Foodie!' });
});

// userprofile/createlist
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

module.exports = router;
