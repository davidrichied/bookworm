var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    favoriteBook: {
      bookid: String,
      title: String,
      available: {
      	type: Boolean,
      	default: false
      }
    },
    password: {
      type: String,
      required: true
    }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
	User.findOne({ email: email })
		.exec(function (error, user) {
			if (error) {
				return callback(error);
			} else if ( !user ) {
				var err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function(error, result) {
				if (result === true) {
					return callback(null, user);
				} else {
					return callback();
				}
			});
		});
}
// UserSchema.pre: pre is a mongo way of hooking into mongo before it saves data to a document
// next: calling next() will run the next function (mongo knows)
// middleware provides a way to process input as it's passed through a chain of commands. Express figures out which middleware runs next.
//hash password before saving to database. 
// a salt is data that's randomly generated for each password to make the resulitng hash value more secure
UserSchema.pre('save', function(next) {
	// this is the user's data object
	// args for hash: password, security level, callback function
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	})
});
var User = mongoose.model('User', UserSchema);
module.exports = User;