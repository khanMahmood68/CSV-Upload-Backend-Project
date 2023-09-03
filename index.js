// USing express as a server
const express = require('express');
const path = require('path');
const fs = require('fs')
const port = 9000;

// Initializing express
const app = express();

// Setting up view engine as ejs
app.set('view engine', 'ejs');

// Setting path of views folder
app.set('views','./views')

// Using parser to read form data
app.use(express.urlencoded({extended: true}));

// Accessing static file from assets folder
app.use(express.static('./assets'));

// Accessing uploaded files from uploads folder
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use('/',require('./routes'))


app.listen(port,(err)=>{
    if(err){
        console.log(`Error ${err}`);
    }
      // deletes the uploaded csv files everytime server restarts
      try { var files = fs.readdirSync(path.join(__dirname,'/uploads')); }
      catch(e) { return; }
      if (files.length > 0)
        for (let i = 0; i < files.length; i++) {
          var filePath = path.join(__dirname,'/uploads',files[i]);
          if (fs.statSync(filePath).isFile()){
            fs.unlinkSync(filePath);
          }
        }
    console.log(`The server is up on port ${port}`);
})