var express = require('express');
var mongo = require('mongodb'); //module to connect to db
var bcrypt= require('bcryptjs');  //module for encrypting and decrypting password
var mongoose = require('mongoose');//module to talk to database 

mongoose.connect("mongodb://localhost/keeperdb");

var db =mongoose.connection;
// const Schema = ;
// user schema

var userschema = mongoose.Schema({
    fullname:{
        type: String,
        index:true
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    profileimg:{
        type: String
    },
    mssg:{
        type: String,
        default:""
        },
    mssgdate:{
        type: Date,
        default:null
    }
});

var User = module.exports= mongoose.model('User',userschema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
};
// module.exports.getPasswordByemail = function(email,callback){
//      User.find({password:/host/}).where('email').equals(email).exec(callback);
//     // console.log(userarr);
//     // return userarr;
// };
module.exports.getUserByUsername = function(email,callback){
     User.find({fullname:/host/}).where('email').equals(email).exec(callback);
    // return userarr.fullname;
    // var query = {fullname:user};
    // User.findOne(query,callback);
};
module.exports.getUserByprofile = function(email,callback){
    var userarr = User.find({profileimg:/host/}).where('email').equals(email).exec(callback);
    return userarr.profileimg;
    // var query = {fullname:user};
    // User.findOne(query,callback);
};
module.exports.getUserByEmail = function(email,callback){
    var query = {email:email};
    User.findOne(query,callback);
    // console.log(User.findOne(query,callback));
};

module.exports.comparePassword = function(candidatepass, hash, callback){
    bcrypt.compare(candidatepass,hash,function(err,ismatch){
        callback(null,ismatch);
    });
};

module.exports.createUser= function(newuser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newuser.password,salt,function(err,hash){
            newuser.password=hash;
            newuser.save(callback);
        });
    });
};

// module.exports= router;