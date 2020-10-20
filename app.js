const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  //campground = require('./models/campground'),
  methodOverride = require('method-override'),
  seedDB = require('./seeds'),
  Comment = require('./models/comment'),
  User = require('./models/user');
//{ findById } = require('./models/comment');
//const { deserializeUser } = require('passport');


//Requiring routes
let commentRoutes = require('./routes/comments'),
    campgroundsRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');


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

app.use(methodOverride('_method'));
//seed the database
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

app.use(indexRoutes);
app.use('/campgrounds',campgroundsRoutes); //all routes will start with /campgrounds
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(3000, () => {
  console.log('The YelpCamp server has started');
});
