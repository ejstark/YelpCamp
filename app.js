const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// const { render } = require('ejs');
//Specify view engine and now we don't have to add .ejs
app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render('landing');
}); 

app.get('/campgrounds', (req,res)=>{
    let campgrounds = [
        {name: 'Camp David', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350'},
        {name: 'Camp Jarome', image: 'https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350'},
        {name: 'Camp John', image: 'https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e50774975287ad1974bcc_340.jpg'}
    ]

    res.render('campgrounds', {campgrounds: campgrounds});
});


app.listen(3000, () => {
    console.log('The YelpCamp server has started');
  });