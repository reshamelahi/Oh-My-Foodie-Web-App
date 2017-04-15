// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 2 or more lists
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  user_fullName: String,
  email: String,
  lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

// comment
// contains a reference to the user who made it
const Comment = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  createdAt: {type: Date, required: true},
});

const Link = new mongoose.Schema({
  url: {type:String, required:true},
  title: {type:String, required:true},
  comments: [Comment],
  votes: Number
});

// a restaurant in a list
// * includes basic information about a restaurant:
//    name, description, location, etc.
const Restaurant = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  type: Array,
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
  priceRange: String,
  upvotes: Number,
  comments: [Comment]
}, {
  _id: true
});

// a restaurant list
// * each list must have a related user
// * a list can have 0 or more items
const List = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date},
  restaurants: [Restaurant]
});

// location of a restaurant
const Location = new mongoose.Schema({
  name: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
  street: String,
  unit: String,
  city: String,
  state: String,
  zipcode: Number,
  country: String
});

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/foodieproject';
}

// TODO: add remainder of setup for slugs, connection, registering models, etc. below
Link.plugin(URLSlugs('name'));

mongoose.model("Comment", Comment);
mongoose.model("Link", Link);
mongoose.model("List", List);
mongoose.model("Restaurant", Restaurant);
mongoose.model("Location", Location);

mongoose.connect(dbconf);
