# Oh My Foodie! 

## Overview

(___TODO__: a brief one or two paragraph, high-level description of your project_)

ATTENTION ALL FOODIES. Are you having a tough time keeping track of the list of places you want to try? Does it bother you that you can’t remember where or what the name of that cute restaurant you passed by was called? Are you interested in networking with other foodies around the world to get their recommendations? Well, now you can do all these things in one place: Oh My Foodie!

Oh My Foodie (OMF!) is a web app that allows users to create a profile and keep track of multiple lists of places they want to try/have tried. They can register and login. After logging in, they can create or view their lists and add places to them. Users can receive recommendations from our very own NomNomGuru. If there’s a restaurant users love and want the world to know about, they can add it to the app. Or if they simply want to connect with foodies around the world, they can chat via our Foodie Network. 


## Data Model

The application will store Users, Lists, Locations, Comments, and Restaurants

* users can have multiple lists (via references)
* each list can have multiple items (by embedding)
* each restaurant can have user comments associated with it


An Example User:

```javascript
{
  user_fullname: "Guru",
	username: "nomnomguru"
	hash: // a password hash,
	email: nomnomguru@gmail.com,
	lists: // an array of references to List documents
}
```

An Example List with Embedded Restaurants:

```javascript
{
  user: // a reference to a User object
	name: "Restaurants in Manhattan",
	restaurants: [
		{ name: "Mamoun’s", visited: false},
		{ name: "Momofuku Milk Bar", visited: true},
	],
	done: false,
	createdAt: // timestamp
}
```
An Example Restaurants:

```javascript
{
  name: "Mamoun's",
	description: "if you're in the nyu area, you have to go to the middle eastern inspired hole in the wall",
	type: ["Middle Eastern", "hole in the wall"],
	location: // reference to Location object,
	pricerange: "$",
	upvotes: 207,
	comments: // embedded Comments
}
```
An Example Location:

```javascript
{
	name: // reference to restaurant object,
	street: "119 MacDougal St",
	unit: "",
	city: "New York",
	state: "NY",
	zipcode: "10012",
	country: "United States"
}
```
An Example Comments:

```javascript
{
	user: // reference to User object
	comment: "I love getting the falafel here!!"
  createdAt: // timestamp
}
```


## [Link to Commented First Draft Schema](db.js) 

(___TODO__: create a first draft of your Schemas in db.js and link to it_)

## Wireframes

(___TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc._)

/list/create - page for creating a new shopping list

![list create](documentation/list-create.png)

/list - page for showing all shopping lists

![list](documentation/list.png)

/list/slug - page for showing specific shopping list

![list](documentation/list-slug.png)

## Site map

(___TODO__: draw out a site map that shows how pages are related to each other_)

Each page will link to the homepage as well as the userprofile

* / - links to:
	* /goodeats
	* /nomnomguru
	* /restaurant/:slug
	
* /goodeats - links to:
	* /goodeats/create
	
* /goodeats/create - links to:
	* /goodeats
	
* /userprofile - links to:
	* /userprofile/createlist
	* /userprofile/list/:slug
	* /goodeats
	* /foodienetwork
	* /nomnomguru
	
* /userprofile/createlist - links to:
	* /userprofile/list/:slug
	
* /userprofile/list/:slug - links to:
	* /userprofile/list
	* /userprofile/list/:slug/addelement
	
* /userprofile/list/:slug/addelement - links to:
	* /userprofile/list/:slug
	
* /nomnomguru - links to:
	* /restaurant/:slug

## User Stories or Use Cases

(___TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://www.mongodb.com/download-center?jmp=docs&_ga=1.47552679.1838903181.1489282706#previous)_)

1. as non-registered user, I can register a new account with the site
2. as a non-registered user, I can search for a restaurant
3. as a non-registered user, I can interact with nomnomguru
4. as a user, I can log in to the site
5. as a user, I can create a new restaurant list
6. as a user, I can view all of the restaurant lists I've created in a single list
7. as a user, I can add items to an existing restaurant list
8. as a user, I can remove items from an existing restaurant list
9. as a user I can delete an existing list
10. as a user, I can chat with other users
11. as a user, I can create a recommendation for a restaurant
12. as a user, I can upvote a specific restaurant
13. as a user, I can search for a restaurant (and filter)
14. as a user, I can add a restaurant if it does not already exist in the database
15. as a user, I can interact with nomnomguru


## Research Topics

(___TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed_)

* (7 points) Integrate user authentication
	* Implement sign-up and registration
	* Implement sign-in with a provider such as FB
* (1 point) Per external API
	* Google maps

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit_)


## [Link to Initial Main Project File](app.js) 

(___TODO__: create a skeleton Express application with a package.json, app.js, views folder, etc. ... and link to your initial app.js_)

## Annotations / References Used

(___TODO__: list any tutorials/references/etc. that you've based your code off of_)

1. [passport.js authentication docs](http://passportjs.org/docs)
2. [tutorial on adding google maps with a marker](https://developers.google.com/maps/documentation/javascript/adding-a-google-map)
