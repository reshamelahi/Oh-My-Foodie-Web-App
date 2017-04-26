// auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1058720764230103', // your App ID
        'clientSecret'  : 'c59d0ea9b8dd3c182abc0f2cd7479ae7', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    }
};