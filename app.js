var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
// Here we are requiring and called the MongoStore module with the session middleware.
var MongoStore = require('connect-mongo')(session);
var app = express();


//When a user logs in, express created a session containing user id. The presence of a session and user id means a user is logged in.
// Express is referred to as a routing and middleware framework. 
// Middlware is software that sits in the middle of our application. It's programming that is run after a request is received but before a response is sent back
// Express uses the body parser module to convert incoming requests into a format that's easy for js program to read
// Sessions are application level middleware because it makes sessions available anywhere in our app.
// In express, middleware has access to the request and response objects

// It's common to keep your middleware outside of the main application.

// Our basic system stores the session data in the memory. Server ram us a limited resource. For a production app, we will use MongoDB to store session data. Connect Mongo middleware will help us.
// app.use statements add middleware to the application.
// use sessions middleware for tracking logins
// secret: required. a string that is used to sign the session ID cookie
// resave: save the session in the session store whether anything changed or not
// You can use sessions even for non-logged in users
// Express typically saves session stores in the RAM. In production, we'll use a database to save session data.
// We will only use sessions for logged in users. Once a session is created, it can be accessed thorugh the req object in any route.
// Usually the cookie only holds the session ID -- a key to associate that one user and browser with a specific collection of session data.


//To add data from the registration form to Mongo DB, we'll need to tell Mongoose about that data.
// To do that we create what's called a model or schema which gives mongoose information about the document that we want to store in mongo
//A model describes what a mongo doc should contain

// mongodb connection
mongoose.connect("mongodb://localhost:27017/bookworm");

var db = mongoose.connection;
//mongo error
db.on('error', console.error.bind(console, 'connection error: '));

// We have to place this after the MongoDB connection. Now, our app stores session data in Mongo instead of in RAM.
app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

// add another level of middleware to make sessions available in the entire application
// make user ID available in templates
// the response object has a prop called locals. Locals lets you add info to the response objects.
// In express, all the views have access to the response's local's object.
app.use(function( req, res, next) {
  res.locals.currentUser = req.session.userId;
  // call the next piece of middleware with the next() function
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(4569, function () {
  console.log('Express app listening on http://192.168.33.10:4569/');
});
