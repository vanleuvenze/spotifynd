var db = require('../models/dbconnect.js');
var User = require('../models/users.js');
var Trips = require('../models/trips.js');
var TripItems = require('../models/tripItem.js');
var request = require('request');
var bluebird = require('bluebird');

var Q = require('q');
var jwt = require('jwt-simple');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);
// var findOneAndUpdate = Q.nbind(User.findOneAndUpdate, User);

module.exports = {
  
  authCheck : function(req, res, next){
    if(req.isAuthenticated()) { return next(); }
    res.redirect('/api/login');
  },

  signup : function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    
    // check to see if user already exists
    findUser({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exist!'));
        }
        // make a new user if not one
        createUser({
          username: username,
          password: password
        })
        //then return that user to the client
        .then(function (created) {
          res.send(created);
          console.log('wow', created);
        })
      })
  },

  login : function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        }
        user.comparePasswords(password)
          .then(function (match) {
            if (match) {
              res.send({id: user._id});
            } else {
              res.send({error: 'wrong password'});
            }
          })
      })
  },

  logout : function(req, res, next) {
    req.logout();
    res.redirect('/api/login');
    console.log('sup')
  },

  updateUserTrips: function (req, res, next) {
    var trips = req.body.trips;
    var id = req.params.id;
    var updates = { $set: {trips: trips} }
    User.findOneAndUpdate({_id: id}, updates, function (err) {
      if (err) {
        res.sendStatus(400);
      }
      res.sendStatus(200);
    });
  },
  getUser: function (req, res, next) {
    var id = req.params.id;
    findUser({_id: id})
      .then(function (user) {
        res.status(200).send(user);
      })
      .catch(function (err) {
        res.sendStatus(400)
      })

  }

};



     