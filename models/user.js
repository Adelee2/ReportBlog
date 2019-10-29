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
    messages:{
        mssg:{
            type: String
        },
        mssgdate:{
            type: Date
        }
    }
});

var User = module.exports= mongoose.model('User',userschema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
};

module.exports.getUserByUsername = function(username,callback){
    var query = {username:username};
    User.findOne(query,callback);
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