const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  //campground = require('./models/campground'),
  seedDB = require('./seeds'),
  Comment = require('./models/comment'),
  User = require('./models/user');
//{ findById } = require('./models/comment');
//const { deserializeUser } = require('passport');

//connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

// const { render } = require('ejs');
//Specify view engine and now we don't have to add .ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

//PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Secret UNLOCKED !',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware would run in every single route
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (req, res) => {
  res.render('landing');
});

//INDEX - show all camgrounds
app.get('/campgrounds', (req, res) => {
    console.log(req.user);
  //retrieve all camgrounds from database
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user });
    }
  });

  //   res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
  //get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;

  let newCampground = { name: name, image: image, description: desc };
  //Create new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      //redirects back to camgrpunds page
      res.redirect('/campgrounds');
    }
  });
});

//form
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

//SHOW - show more info about one campground
app.get('/campgrounds/:id', (req, res) => {
  //find campground with provided id, and populate the finsing with comments from comments database
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        console.log(foundCampground.name);

        //render show template with that campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

//=====================
// COMMENTS ROUTES
//=====================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

app.post('/campgrounds/:id/comments',isLoggedIn, (req, res) => {
  //lookup campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();

          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
  //create new comment

  //connect new comments to campground

  //redirect camground show page
});
// ======================
// AUTHENTICATE ROUTES
//===========================

//show register form
app.get('/register', (req, res) => {
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

app.post('/register', (req, res) => {
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

// app.post('/register', function(req, res) {
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
// app.post(
//   '/register',
//   registerUser, // register user in the DB
//   passport.authenticate('local'), // authenticate user credentials
//   (req, res) => {console.log(req.user.username);  res.redirect('/');} // redirect user
// );

// app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
});

//handling login logic
// app.post('/login', function(req, res, next) {
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

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {}
);

//logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(3000, () => {
  console.log('The YelpCamp server has started');
});
