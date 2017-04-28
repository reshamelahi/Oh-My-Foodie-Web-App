// auth.js

// expose our config directly to our application using module.exports
module.exports = {
	"development": {
	    'facebookAuth' : {
	        'clientID'      : '1058720764230103', // your App ID
	        'clientSecret'  : 'c59d0ea9b8dd3c182abc0f2cd7479ae7', // your App Secret
	        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
	    },
	    mongodb: 'mongodb://localhost/foodieproject'
	},

	"production_shweta": {
	    'fbAuth_shweta' : {
	        'clientID'      : '1058720764230103', // your App ID
	        'clientSecret'  : 'c59d0ea9b8dd3c182abc0f2cd7479ae7', // your App Secret
	        'callbackURL'   : 'http://linserv1.cims.nyu.edu:13575/auth/facebook/callback'
	    },
	    mongodb: process.env.MONGO_URI
	},

	"production_resham": {
	    'fbAuth_Resham' : {
	        'clientID'      : '1058720764230103', // your App ID
	        'clientSecret'  : 'c59d0ea9b8dd3c182abc0f2cd7479ae7', // your App Secret
	        'callbackURL'   : 'http://linserv1.cims.nyu.edu:12873/auth/facebook/callback'
	    },
	    mongodb: process.env.MONGO_URI
	}
};