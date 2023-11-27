module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      db.collection('books').find().toArray((err, result) => {
        console.log('Books Data:', result);
        if (err) return console.log(err);
        res.render('profile.ejs', {
          
          user: req.user,
          books: result  // Changed 'messages' to 'books'
        });
      });
  });
  

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================


// Check out a book (mark it as not available)
app.post('/books/checkout', (req, res) => {
  const isbn = req.body.isbn;
  
  db.collection('books').findOneAndUpdate(
    { isbn: isbn },
    {
      $set: {
        available: false // Mark the book as not available
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err);
      res.redirect('/profile'); // Redirect back to the profile page
    });
});

// Return a book (mark it as available)
//create books
app.post('/books/add', (req, res) => {
  db.collection('books').insertOne({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    available: true,
  }, (err, result) => {
    if (err) return console.log(err);
    console.log('Book added to database');
    res.redirect('/profile');
  });
});
app.post('/books/return', (req, res) => {
  const isbn = req.body.isbn;

  db.collection('books').findOneAndUpdate(
    { isbn: isbn },
    {
      $set: {
        available: true // Mark the book as available again
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err);
      res.redirect('/profile'); // Redirect back to the profile page
    });
});

//Update book information
// app.put('/books', (req, res) => {
//   db.collection('books').findOneAndUpdate(
//     { isbn: req.body.isbn },
//     {
//       $set: {
//         title: req.body.title,
//         author: req.body.author,
//         // Update other fields as necessary
//       }
//     }, {
//       sort: { _id: -1 },
//       upsert: true
//     }, (err, result) => {
//       if (err) return res.send(err);
//       // res.send(result);
//       res.redirect('/profile');
//     });
// });

// Check out a book (mark it as not available)
app.put('/books', (req, res) => {
  db.collection('books').findOneAndUpdate(
    { isbn: req.body.isbn },
    {
      $set: {
        available: false // Mark the book as not available
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    });
});

// Delete a book
app.delete('/books', (req, res) => {
  db.collection('books').findOneAndDelete({ isbn: req.body.isbn }, (err, result) => {
    if (err) return res.send(500, err);
    console.log('Book deleted');
    res.send('Book deleted!');
  });
});



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
