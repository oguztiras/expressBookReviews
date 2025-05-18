const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password; // no hash usage! --- just registration implementation

    // Check if both username and password provided
    if (username && password) {
        // Check if user does not already exist
        if(!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"})
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({message:"No book with the given isbn"})
    }

    res.send(JSON.stringify(book))
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    let theBooks = Object.values(books).filter(book => 
        book.author.toLowerCase().includes(author)
    );

    if (theBooks.length === 0) {
        return res.status(404).json({message:"No book with the given title"})
    }

    res.send(JSON.stringify(theBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    let theBooks = Object.values(books).filter(book => 
        book.title.toLowerCase().includes(title)
    );

    if (theBooks.length === 0) {
        return res.status(404).json({message:"No book with the given title"})
    }

    res.send(JSON.stringify(theBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({message:"No book with the given isbn"})
    }

    res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
