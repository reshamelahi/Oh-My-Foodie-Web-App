// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

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

// a restaurant list
// * each list must have a related user
// * a list can have 0 or more items
const List = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  createdAt: {type: Date, required: true},
  restaurants: [Restaurant]
});

// a restaurant in a list
// * includes basic information about a restaurant:
//    name, description, location, etc.
const Restaurant = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  type: Array;
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'} ,
  priceRange: String,
  upvotes: Number,
  comments: [Comment]
}, {
  _id: true
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

// comment
// contains a reference to the user who made it
const Comment = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  comment: String,
  createdAt: {type: Date, required: true},
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below
