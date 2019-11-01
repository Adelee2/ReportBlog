var express = require('express');
// var {check,body,validationResult} = require('express-validator/check');
var passport = require('passport'); //module for password
var LocalStrategy = require('passport-local').Strategy; //module for passwordvar router = express.Router();
var multer  = require('multer');  //module for uploading pictures
var upload = multer({ storage: filestorage}); //module for uploading pictures
var router = express.Router();

var filestorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads'); 
  },
  filename:(req,file,cb)=>{
    console.log(new Date().toISOString() +'-' + file.originalname);
    cb(null,new Date().toISOString() +'-' + file.originalname);
  }
});
// var fileFilters = (file,cb)=>{
//   if(file.mimetype === 'image/png' || 
//     file.mimetype === 'image/PNG' ||
//     file.mimetype === 'image/jpg' || 
//     file.mimetype === 'image/JPG' || 
//     file.mimetype === 'image/JPEG' ||
//     file.mimetype === 'image/jpeg'){
//     cb(null,true);
//   }else{
//     cb(null,false);
//   }
// };

var User = require('../models/user');

var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.isLoggedIn !== true){
    // console.log('session not yet started');
    res.render('index', { isAuthenticated:req.session.isLoggedIn});
  }
  else{
    // console.log('session started ');
    // console.log(req.session.isLoggedIn);
    res.render('index', {
               isAuthenticated:req.session.isLoggedIn,
               name:req.session.user,
               email:req.session.email,
               profileimg:req.session.profile
              });
    }
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
    else{
      // console.log("code got here!!!!!!");
      var newUser = new User({
        fullname: fullname,
        email: email,
        password: password,
        profileimg:  profileimg
      });
      User.createUser(newUser,function(err){
        console.log(err);
        if(err) throw err;
      });

      req.flash('success','you are now registered.please login to continue');
      res.redirect('/login');
    }

});

router.get('/report', function(req, res, next) {
  if(req.session.isLoggedIn !== true){
    // console.log('session not yet started');
    res.render('blog',{isAuthenticated:req.session.isLoggedIn});
  }
  else{
    // console.log('session started');
    res.render('blog', {
               isAuthenticated:req.session.isLoggedIn,
               name:req.session.user,
               email:req.session.email,
               profileimg:req.session.profile
              });
    }
});
router.post('/report', function(req, res, next) {
  var isAuthenticated=req.session.isLoggedIn;
  if(!isAuthenticated){
    req.flash('error','please login to continue');
    return res.redirect('/login');
  }

  var mssg = req.message;
  if(mssg){
    var newUser = new User({
      mssg:mssg, 
      mssgdate: new Date()
    });
  }
  else
    return res.status(422).render('/report',{errormessage:"enter message"});
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Register Here' });
});

router.get('/login', function(req, res, next) {
  let emessage =  req.flash('error');
  let smessage = req.flash('success');
  console.log(emessage.length+" "+emessage);
  console.log(smessage.length+" "+smessage);
  if(smessage.length >0){
    smessage =smessage[0];
    emessage=null;
  }
  else if(emessage.length > 0){
    emessage = emessage[0];
    smessage=null;
  }
  else{
    emessage=null;
    smessage=null;
  }
  res.render('login-full', { 
    errormessage: emessage,
    successmessage:smessage,
    oldinput: {email:"", password:"" }
  });
});
// passport.serializeUser(function(user,done){
//   done(null,user.id);
// });
// passport.deserializeUser(function(id,done){
//   User.getUserById(id,function(err,user){
//     done(err,user);
//   });
// });

// passport.use(new LocalStrategy((email,pass,done)=>{
//   User.getUserByEmail(email,(err,user)=>{
//     if(err) throw err;
//     if(!user){
//       return done(null,false,{message:'unknown email'});
//     }
//     User.comparePassword(pass,user.password,function(err,ismatch){
//       console.log("pass is "+pass);
//       console.log("user.pass is "+user.password);
//       if(err) return done(err);
//       if(ismatch){
//         return done(null,user);
//       }else{
//         return done(null,false,{message:'Invalid Password'});
//       }
//     });
//   });
// }));
router.post('/login',
  // passport.authenticate('local',{failureRedirect:'/login',failureFlash:'invalid username or password'}),
  function(req,res,next){ //post data in the login page den go to index page
    const inputemail = req.body.email;
    const inputpass = req.body.pass;
     User.getUserByEmail(inputemail,(err,user)=>{
          if(err) throw err;
          if(!user){
            return done(null,false,{message:'unknown email'});
          }
          
          // const user =  User.find({password:/host/}).where('email').equals(inputemail).exec(done(null,false));
          // console.log(userpass) 
      User.comparePassword(inputpass,users,function(err,ismatch){
            console.log("pass is "+inputpass);
            console.log("users is "+users);
            if(err) return done(err);
            if(ismatch){
              return done(null,user);
            }else{
              return done(null,false,{message:'Invalid Password'});
            }
          });
        });
    req.session.isLoggedIn=true;
    req.session.email=req.email;
    req.session.user=User.getUserByUsername(req.email,(err,user)=>{
      if(err) throw err;
      if(!user){
        return done(null,false,{message:'unknown user'});
      }
    });
    req.session.profile=User.getUserByprofile(req.email,(err,user)=>{
      if(err) throw err;
      if(!user){
        return done(null,false,{message:'unknown profileimage'});
      }
    });

    req.flash('success','you are now logged in');
    res.redirect('/');
});

module.exports = router;
