const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

// const { render } = require('ejs');
//Specify view engine and now we don't have to add .ejs
app.set('view engine', 'ejs');

let campgrounds = [
    {name: 'Camp David', image: 'https://pixabay.com/get/52e5d7414355ac14f1dc84609620367d1c3ed9e04e507749752873d29448cd_340.jpg'},
    {name: 'Camp Jarome', image: 'https://pixabay.com/get/53e4d1424b56a814f1dc84609620367d1c3ed9e04e507749752873d29448cd_340.jpg'},
    {name: 'Camp John', image: 'https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507749752873d29448cd_340.jpg'}
]

app.get('/', (req,res)=>{
    res.render('landing');
}); 

app.get('/campgrounds', (req,res)=>{


    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req,res)=>{
    //get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    //redirects back to camgrpunds page
    res.redirect('/campgrounds');
});

//show form
app.get('/campgrounds/new', (req,res) =>{
    res.render('new.ejs');
});

app.listen(3000, () => {
    console.log('The YelpCamp server has started');
  });