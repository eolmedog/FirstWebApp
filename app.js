//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt=require('mongoose-encryption');

app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/secretsDB', {
  useNewUrlParser: true
});
userSchema = new mongoose.Schema({
  username: String,
  password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});
const User = mongoose.model("User", userSchema);

app.listen(3000, function(req, res) {
  console.log('Listening on port 3000');
})

app.get('/', function(req, res) {
  res.render('home');
});

app.route('/login')
  .get(function(req, res) {
    res.render('login');
  })
  .post(function(req, res) {
      let username = req.body.username;
      let password = req.body.password;
      User.findOne({
          username: username
          }, function(err, results) {
          if (results) {
            if(password===results.password){
            res.render('secrets');
          } else {
            res.render('login');
          }
        }
          else{
            res.render('login');
          }

      })
  });

app.route('/register')
  .get(function(req, res) {
    res.render('register');
  })
  .post(function(req, res) {
    var userinfo = new User(req.body);
    userinfo.save(function(err) {
      if (!err) {
        console.log('Succesfully registered ' + userinfo.username);
        res.render('secrets');
      }
    });

  })
