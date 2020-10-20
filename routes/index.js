
const express = require('express');
const router = express.Router()
const passport = require('passport');
const User = require('../models/user');

//root route
router.get('/', (req, res) => {
    res.render('landing');
  });
  
  
  // ======================
  // AUTHENTICATE ROUTES
  //===========================
  
  //show register form route
  router.get('/register', (req, res) => {
    res.render('register');
  });
  
  //handle signup logic
  const registerUser = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = new User({ username });
      await User.register(user, password);
      return next();
    } catch (e) {
      return next(e);
    }
  };
  
  router.post('/register', (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render('register');
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/campgrounds');
        });
      }
    });
  });
  
  // router.post('/register', function(req, res) {
  //     // attach POST to user schema
  //     var user = new User({ password: req.body.password, name: req.body.name });
  //     // save in Mongo
  //     user.save(function(err) {
  //       if(err) {
  //         console.log(err);
  //       } else {
  //         console.log('user: ' + user.name + " saved.");
  //         req.login(user, function(err) {
  //           if (err) {
  //             console.log(err);
  //           }
  //           return res.redirect('/campgrounds');
  //         });
  //       }
  //     });
  //   });
  // router.post(
  //   '/register',
  //   registerUser, // register user in the DB
  //   passport.authenticate('local'), // authenticate user credentials
  //   (req, res) => {console.log(req.user.username);  res.redirect('/');} // redirect user
  // );
  
  // router.post('/register', (req, res) => {
  //   let newUser = new User({ username: req.body.username });
  //   User.register(newUser, req.body.password, (err, user) => {
  //     if (err) {
  //       console.log(err);
  //       return res.render('register');
  //     } else {
  //       passport.authenticate('local', (err, user, info)=>{
  //         res.redirect('/campgrounds');
  //       })(req, res, next)
  
  //     }
  //   });
  // });
  
  //SHOW LOGIN FORM
  router.get('/login', (req, res) => {
    res.render('login');
  });
  
  //handling login logic
  // router.post('/login', function(req, res, next) {
  //     passport.authenticate('local', (err, user, info) => {
  //       if (err) { return next(err) }
  //       if (!user) {
  //         return res.render('/login', {
  //           form: req.body
  //         });
  //       }
  //       req.logIn(user, function(err) {
  //         if (err) { return next(err); }
  //         return res.redirect('/campgrounds');
  //       });
  //     })(req, res, next); // <=== Do not forget to add these.
  // });
  

  //handling login logic
  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/campgrounds',
      failureRedirect: '/login',
    }),
    (req, res) => {}
  );
  
  //logout route
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
  });
  

  //middleware
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  module.exports = router;