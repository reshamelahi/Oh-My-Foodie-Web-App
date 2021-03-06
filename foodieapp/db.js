// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 2 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  facebook_id: String,
  facebook_token: String,
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  lists:  [{type: mongoose.Schema.Types.ObjectId, ref: 'List'}]
});

// methods ======================
// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// comment
// contains a reference to the user who made it
const Comment = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: {type:String, required:true},
  name: {type:String, required:true}
  //createdAt: {type: Date, required: true},
});

const Link = new mongoose.Schema({
  url: {type:String, required:true},
  title: {type:String, required:true},
  comments: [Comment],
});

// a restaurant in a list
// * includes basic information about a restaurant:
//    name, description, location, etc.
const Restaurant = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type:String, required:true},
  type: {type: Array, required:true},
  priceRange: {type:String, required:true},
  upvotes: Number,
}, {
  _id: true
});

// a restaurant list
// * each list must have a related user
// * a list can have 0 or more items
const List = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: String,
  createdAt: {type: Date},
  restaurants: [Restaurant]
});

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/foodieproject';
}

// TODO: add remainder of setup for slugs, connection, registering models, etc. below
Link.plugin(URLSlugs('title'));
List.plugin(URLSlugs('name'));
Restaurant.plugin(URLSlugs('name'));
User.plugin(passportLocalMongoose);

mongoose.model("User", User);
mongoose.model("Comment", Comment);
mongoose.model("Link", Link);
mongoose.model("List", List);
mongoose.model("Restaurant", Restaurant);

mongoose.connect(dbconf);
