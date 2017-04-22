var mongoose = require('mongoose');

// This is just an array of user IDs that will be added to a Book
// We can retrieve all the readers of a book with the following command
// Fetch the Book document identified by its ID
// book = db.books.findOne({_bookid: 1234});
   // Fetch all the readers that are linked to this Book
// book_readers = db.users.find({_id: { $in : book.readers } } ).toArray() ;

// When a user adds a book, their ID will be added to the book
var BookSchema = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: false,
      trim: true
    },
    readers: []
});

var Book = mongoose.model("Book", BookSchema);

module.exports = Book;