//jshint esversion:6
const port = 4000;
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const ejs = require('ejs')
const bcrypt = require('bcrypt');
const saltrounds = 10;


// ==== mongoose connection ==== //
mongoose.connect('mongodb://localhost:27017/UserDB', {useNewUrlParser: true,useUnifiedTopology: true});
// ==== user schema ==== //
const userSchema = mongoose.Schema({
  email: String,
  password:String
})
// ==== user mogdel ==== //
const User = new mongoose.model('User',userSchema)

// ==== settings ==== //
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.set('view engine','ejs')

// ==== HTML requests ==== //

app.get('/',(req,res)=>{
  res.render('home')
});
app.get('/login',(req,res)=>{
  res.render('login')
});
app.get('/register',(req,res)=>{
  res.render('register')
});


app.post('/register',(req,res)=>{
  bcrypt.hash(req.body.password, saltrounds, function(err, hash) {
    // Store hash in your password DB.
    var newuser = new User({
      email: req.body.username,
      password: hash
    });
    newuser.save((err)=>{
      if(!err){
        res.render('secrets')
      }else{
        console.log(err)
      }
    })
});

});

app.post('/login',(req,res)=>{
  User.findOne({email:req.body.username},(err,found)=>{
    if (!err){
      if(found){
        bcrypt.compare(req.body.password, found.password, function(err, result) {
          if(!err){
            if(result===true){
              res.render('secrets')
            }else{
              console.log('not found')
            }
          }
        });

      }

    }

  })
})


app.listen(port,function(){
  console.log('listening on port '+port)
})
