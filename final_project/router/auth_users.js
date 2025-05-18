const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const newReview = req.query.newReview;
    const book = books[isbn];
    const username = req.session.authorization["username"];
    const reviews = book.reviews;

    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }

    const isNew = reviews[username] === undefined;
    reviews[username] = newReview;

    console.log("user: ", username);
    console.log("reviews: ", reviews);

    res.send(JSON.stringify({
        message: isNew ? "New review added" : "Existing review updated"
    }));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const reviews = book.reviews;
    const username = req.session.authorization["username"];

    if (reviews[username] === undefined) {
        return res.status(404).json({message:"No review for given user and book"});
    } else {
        delete reviews[username];
        res.send(JSON.stringify({message:"Review deleted"}));
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
