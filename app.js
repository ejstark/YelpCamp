const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// const { render } = require('ejs');
//Specify view engine and now we don't have to add .ejs
app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render('landing');
});


app.listen(3000, () => {
    console.log('The YelpCamp server has started');
  });