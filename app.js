const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

//connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

// const { render } = require('ejs');
//Specify view engine and now we don't have to add .ejs
app.set('view engine', 'ejs');

// SCHEMA SETUP for database
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

//make a model that uses the declared schema
let Campgrounds = mongoose.model('Campground', campgroundSchema);

//create an entry and add to database
// Campgrounds.create({
//     name: 'Camp Alpha',
//     image:
//       'https://media.gettyimages.com/photos/senior-couple-camping-in-the-mountains-and-eating-a-snack-picture-id1031972950?s=2048x2048',
//     description: 'One of the oldest camps, classic view.'
// }, (err, campground)=>{
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Newly created campground:');
//         console.log(campground);
//     }
// });



app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  //retrieve all camgrounds from database
  Campgrounds.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: allCampgrounds });
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
  Campgrounds.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      //redirects back to camgrpunds page
      res.redirect('/campgrounds');
    }
  });
});

//show form
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

//SHOW - show more info about one campground 
app.get('/campgrounds/:id', (req,res)=>{
    //find campground with provided id
    Campgrounds.findById(req.params.id, (err, foundCamground)=>{
        if (err) {
            console.log(err);
        } else{
            //render show template with that campground
    res.render('show', {campground: foundCamground});
        }
    });  
});

app.listen(3000, () => {
  console.log('The YelpCamp server has started');
});
