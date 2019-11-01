var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');//module for allocating sessions
var passport = require('passport'); //module for password
var LocalStrategy = require('passport-local').Strategy; //module for password
// var multer  = require('multer');  //module for uploading pictures
// var upload = multer({ storage: filestorage, fileFilter:fileFilters}); //module for uploading pictures
var flash = require('connect-flash');  //module for flash messages
var mongo = require('mongodb'); //module to connect to db
var bcrypt= require('bcryptjs');  //module for encrypting and decrypting password
var mongoose = require('mongoose');//module to talk to database
// var csrf = require('csurf');

var db = mongoose.Connection; 

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// app.use(app.router);
// indexRouter.initialize(app);

// var csrfprotection = csrf();
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(csrfprotection);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(multer({dest:'uploads'}).single('fileupload'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //giving access to my css and js files

//handling sessions
app.use(session({secret:'my secret to node', saveUninitialized:false, resave:false}));
//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
