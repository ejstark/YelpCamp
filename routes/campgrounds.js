const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

//INDEX - show all camgrounds
router.get('/', (req, res) => {
  console.log(req.user);
  //retrieve all camgrounds from database
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      });
    }
  });
  //   res.render('campgrounds', { campgrounds: campgrounds });
});

//CREATE - add new camground to DB
router.post('/', (req, res) => {
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

//NEW - show form to create new camground
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

//SHOW - show more info about one campground
router.get('/:id', (req, res) => {
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

//EDIT Campground route
router.get('/:id/edit', (req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err) {
            res.redirect('campgrounds')
        }
    })
    red.render('camgrounds/edit', {campground: foundCampground});
});


//UPDATE Campground route


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// export from file
module.exports = router;
