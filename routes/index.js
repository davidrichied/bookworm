var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book.js');
// add the index.js file in the folder middleware
var mid = require('../middleware');


// GET /suggest-book
router.get('/suggest-book', mid.requiresLogin, function (req, res, next) {
  return res.render('suggest-book', { title: 'Suggest Book' });
});

// POST /suggest-book
router.post('/suggest-book', function(req, res, next) {
  if (req.body.title) {

      // create object with form input
      var bookData = {
        title: req.body.title
      };

      // use schema's `create` method to insert document into Mongo
      Book.create(bookData, function (error, book) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/profile');
        }
      });
      
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

// GET /add-book
router.get('/add-book', mid.requiresLogin, function(req, res, next) {
  var query = Book.find();
  query.select('title');
  query.exec(function (err, books) {
    return res.render('add-book', { title: 'Add Book', books: books });
  });
});

// POST /add-book
router.post('/add-book', function(req, res, next) {
  if (req.body.book) {
      // create object with form input
      // var bookData = {
      //   book: req.body.book
      // };
      Book.findById(req.body.book, function(err, book) {
        if (err) return next(err);

        User.findById(req.session.userId, function(err, user) {
          if (err) return next(err);

          user.favoriteBook.bookid = req.body.book;
          user.favoriteBook.title = book.title;

          user.save(function (err) {
            if (err) {
              return next(err);
            }
          });
        });
        book.readers.push( req.session.userId );

        book.save(function (err) {
          if (err) {
            return next(err);
          } else {
            return res.redirect('/profile');
          }
        });
      });
      // use schema's `create` method to insert document into Mongo

      
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

// GET /profile
// When a user succesfully logs in, their user id (from mongo) is stored as a session variable. No user id (! req.session.userId) in session means they are not logged in
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  // if the session id is present, get the user's data from mongo
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) return next(error);
      // if the user has chosen a book
      if (user.favoriteBook.bookid) {
        // find that book
        Book.findById(user.favoriteBook.bookid, function(err, book) {
          if (err) return next(err);
          // if the book has readers
          if (book.readers) {
            // find the readers
            User.find({_id: { $in : book.readers } }).exec(function(err, users) {
              if (err) return next(err);
              return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook.title, users: users });
            });
          } else { // if the book doesn't have readers
            return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook.title, users: false });
          }
        });
      } else { // if user hasn't chosen a book yet
        return res.render('profile', { title: 'Profile', name: user.name, favorite: false, users: false });
      }
      
        // if there is no error, render the template and pass the mongo data into it
        
    });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next){
	return res.render('login', { title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next){
	if(req.body.email && req.body.password) {
    // User is our model. authenticate was a method created in the model
    // The callback checks if there are errors (bad password, no email)
		User.authenticate(req.body.email, req.body.password, function(error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.');
        // all authentication errors get a status code of 401. 401 means unauthorized
				err.status = 401;

				return next(err);
        // if the user is authenticated, we can create a session using the user's id drawn from the mongo document. Session is only stored on the server.
        // express add session data to the request object
			} else {
        // all we have to do to create a session is assign a user id to the req session.
        // user is the document
        // user._id is the unique mongo id
				req.session.userId = user._id;
				return res.redirect('/profile');
			}
		});
	} else {
    var errMsg = req.body.password + ' ' + req.body.email;
		var err = new Error(errMsg);
		err.status = 401;
		return next(err);
	}
});

// add our custom middleware mid.loggedOut to control what logged in and logged out users see. Our custom middleware parameter goes in the middle. Simply adding the middleware to the parameters will cause it to run.
//GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
	return res.render('register', { title: 'Sign Up' });
});

//req is the information coming from the browser (the user)
//POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          // This will automatically log the user in after they register
        	req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
      
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});



// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;