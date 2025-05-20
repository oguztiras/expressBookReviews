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

// Get the book list available in the shop using promise
public_users.get('/async', function(req,res) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 2000)
    }).then(data => {
        res.send(JSON.stringify(data));
    })
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

// Get book details based on ISBN using promise
public_users.get('/isbn/async/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const isbn = req.params.isbn;
            const book = books[isbn];
            console.log(book);
            resolve(book);
        }, 2000)
    }).then(data => {
        if (!data) {
            return res.status(404).json({message:"No book with the given isbn"})
        }
        res.send(JSON.stringify(data))
    })
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

// Get book details based on author using async-await
public_users.get('/author/async/:author', async function (req, res) {
    try {
        const author = req.params.author.toLowerCase();

        const theBooks = await new Promise((resolve, reject) => {
            setTimeout(() =>{
                const data = Object.values(books).filter(book => 
                    book.author.toLowerCase().includes(author)
                );
                resolve(data)
            }, 2000);
        });

        if (theBooks.length === 0) {
            return res.status(404).json({message:"No book with the given title"})
        }
    
        res.send(JSON.stringify(theBooks));
    } catch (err) {
        res.status(500).json({message:"internal server error"});
    }
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

// Get all books based on title using async-await
public_users.get('/title/async/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();

        const theBooks = await new Promise((resolve, reject) => {
            setTimeout(() =>{
                const data = Object.values(books).filter(book => 
                    book.title.toLowerCase().includes(title)
                );
                resolve(data)
            }, 2000);
        })

        if (theBooks.length === 0) {
            return res.status(404).json({message:"No book with the given title"})
        }

        res.send(JSON.stringify(theBooks));
    } catch (err) {
        res.status(500).json({message:"internal server error"});
    }
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
