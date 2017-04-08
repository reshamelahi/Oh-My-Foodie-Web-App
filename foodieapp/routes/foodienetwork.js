var express = require('express');
var router = express.Router();

// foodienetwork
router.get('/foodienetwork', (req, res) => {
	// Link.find({}, (err, links) => {
    res.render('index');
  // });
});

// router.post('/foodienetwork', (req, res) => {
//   const l = new Link({
//     url: req.body.url, 
//     title: req.body.title,
//     votes: 0
//   });
//   l.save((err, links) => {
//     if(err) {
//         res.render('linksform', {links:links, err:err}); 
//     }
//     else { res.redirect('/foodienetwork'); }
//   });
// });

// router.get('/foodienetwork/:slug', function(req, res) {
//   Link.findOne({slug: req.params.slug}, (err, links) => {
//     const latestComment = req.session.lastComment || '';
//     if (req.query.button === "Vote") {
//       Link.findOneAndUpdate({slug: req.params.slug}, {$inc: {votes: 1}}, (err, links) => {
//         res.redirect("/foodienetwork");
//       });
//     }
//     else { res.render('commentform', {links: links, 'lastComment': latestComment}); }
//   });
// });

// router.post('/foodienetwork/:slug', (req, res) => {
//   const slugVar = req.params.slug;
//   Link.findOneAndUpdate({slug: slugVar}, {$push: {comments: {text: req.body.text, name:req.body.name}}}, (err, links) => {
//     if(err) {
//         res.render('commentform', {links:links, err:err}); 
//     }
//     else {
//       req.session.lastComment = req.body.text;
//       res.redirect('/foodienetwork/' + slugVar);
//     }
//   });
// });

module.exports = router;