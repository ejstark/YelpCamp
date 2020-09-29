const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Campground = require('./models/campground');
const campground = require('./models/campground');
const { findById } = require('./models/comment');
const seedDB = require('./seeds');
const Comment = require('./models/comment');

seedDB();
//connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

// const { render } = require('ejs');
//Specify view engine and now we don't have to add .ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  //retrieve all camgrounds from database
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
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
        //console.log(foundCampground);
        //console.log(foundCampground.name);

        //render show template with that campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

//=====================
// COMMENTS ROUTES
//=====================

app.get('/campgrounds/:id/comments/new', (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(3000, () => {
  console.log('The YelpCamp server has started');
});
