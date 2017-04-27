const express = require('express');
const passport = require('passport');

const router = express.Router();

/**
 * Facebook Login
 */
router.get('/login', passport.authenticate('facebook', {session: true, scope: ['email']}));

/**
 * Facebook Logout
 */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * Facebook Auth Callback
 */
router.get('/facebook/return',
    passport.authenticate('facebook', {
        failureRedirect: '/auth/login',
        successRedirect: '/',
        failureFlash: true
    })
);

module.exports = router;