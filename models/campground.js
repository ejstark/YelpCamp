const mongoose = require('mongoose');


// SCHEMA SETUP for database
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
//embadding a reference to the comments (an id)
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
  });

  //make a model that uses the declared schema
module.exports = mongoose.model('Campground', campgroundSchema);