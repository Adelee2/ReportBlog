var express = require('express');
// var {check,body,validationResult} = require('express-validator/check');
var passport = require('passport'); //module for password
var LocalStrategy = require('passport-local').Strategy; //module for passwordvar router = express.Router();
var multer  = require('multer');  //module for uploading pictures
var upload = multer({ storage: filestorage, fileFilter:fileFilters}); //module for uploading pictures

var filestorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads'); 
  },
  filename:(req,file,cb)=>{
    cb(null,new Date().toISOString() +'-' + file.originalname);
  }
});
var fileFilters = (req,file,cb)=>{
  if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/PNG' ||
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/JPG' || 
    file.mimetype === 'image/JPEG' ||
    file.mimetype === 'image/jpeg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
};

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home page' });
});

router.get('/register', function(req, res) {
  res.render('registration-full', { 
    errormessage: "",
    oldinput: {name:"", email:"", password:"", password2:"" }
  });
});

router.post('/register', upload.single('fileupload'), function(req, res, next) 
  {
    var fullname=req.body.names;
    var email = req.body.email;
    var password = req.body.pass1;
    var password2 = req.body.pass2;
    if(!req.file){
      // console.log(profileimg);
      var profileimg = "";
    }
    else{
      console.log(req.file.filename);
      var profileimg = req.file.filename;
    }
    if(password !== password2){
      return res.status(422).render('registration-full', { 
            errormessage: false,
            oldinput: {name:fullname, email:email, password:password, password2:password2}
          });
    }
    // var errors = validationResult(req);
    // if(errors.isEmpty()){
    //   console.log(errors.array());
    //   return res.status(422).render('registration-full', { 
    //     errormessage: errors.array(),
    //     oldinput: {name:fullname, email:email, password:password, password2:password2}
    //   });
    // }
    else{
      // console.log("code got here!!!!!!");
      var newUser = new User({
        fullname: fullname,
        email: email,
        password: password,
        profileimg:  profileimg
      });
      // newUser.save().then(result =>{
      //   // console.log('code got here!!');
      //   // req.flash('success','You are now registered!!');
        // req.flash('success','you are registered!!!');
        // res.redirect('/login');
      // })
      // .catch(err=>{
      //   console.log(err);
      // });
      User.createUser(newUser,function(err){
        console.log(err);
        if(err) throw err;
      });

      req.flash('success','you are registered!!!');
      res.redirect('/login');
    }

});

router.get('/report', function(req, res, next) {
  res.render('blog', { title: 'Register Here' });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Register Here' });
});

router.get('/login', function(req, res, next) {
  res.render('login-full', { 
    errormessage: "",
    oldinput: {email:"", password:"" }
  });
});
passport.serializeUser(function(user,done){
  done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.getUserById(id,function(err,user){
    done(err,user);
  });
});

passport.use(new LocalStrategy(function(username,password,done){
  User.getUserByUsername(username,function(err,user){
    if(err) throw err;
    if(!user){
      return done(null,false,{message:'unknown user'});
    }
    User.comparePassword(password,user.password,function(err,ismatch){
      if(err) return done(err);
      if(ismatch){
        return done(null,user);
      }else{
        return done(null,false,{message:'Invalid Password'});
      }
    });
  });
}));
router.post('/login',
  passport.authenticate('local',{failureRedirect:'/login',failureFlash:'invalid username or password'}),
  function(req,res,next){ //post data in the login page den go to index page
  req.flash('success','you are now logged in');
  res.redirect('/');
});

module.exports = router;
