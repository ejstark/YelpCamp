const mongoose = require('mongoose');
const Campgrounds = require('./models/campground');
const Comment = require('./models/comment');

let data = [
  {
    name: 'Camp Alpha',
    image:
      'https://media.gettyimages.com/photos/senior-couple-camping-in-the-mountains-and-eating-a-snack-picture-id1031972950?s=2048x2048',
    description: 'One of the oldest camps, classic view.',
  },
  {
    name: 'Lakey camp',
    image:
      'https://media.gettyimages.com/photos/camping-life-picture-id1059448246?s=2048x2048',
    description: 'This camp has a great view of the lake.',
  },
  {
    name: 'Beach camp',
    image:
      'https://media.gettyimages.com/photos/family-on-beach-in-the-rain-picture-id83462522?s=2048x2048',
    description: 'Beautiful sand beach.',
  },
];

function seedDB() {
  //remove all campgounds
  Campgrounds.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
    console.log('removed campgrounds!');
    //add few camgrounds
    data.forEach((seed) => {
      Campgrounds.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log('added camground');
          //create comment
          Comment.create(
            {
              text: 'This place is great, but I wish there was internet',
              author: 'John T.',
            },
            (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log('Created new comment');
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
