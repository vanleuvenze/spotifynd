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
    console.log("req body",req.body)
    
    // check to see if user already exists
    findUser({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          // make a new user if not one
          return createUser({
            username: username,
            password: password
          });
        }
      })
      .then(function (user) {
        // create token to send back for auth
        //var token = jwt.encode(business, 'secret');
        req.session.user = username;
        res.send(user);
        //res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  login : function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log("Logging in user", req.body);

    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function (foundUser) {
              if (foundUser) {
                //var token = jwt.encode(business, 'secret');
                //console.log(".............");
                //console.log();
                req.session.regenerate(function(){
                  req.session.user = username;
                });
                res.send({id: user._id});
                //res.json({token: token});
              } else {
                return next(new Error('No User'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  logout : function(req, res, next) {
    req.logout();
    res.redirect('/api/login');
  },

  findUser: function(req, res, next) {
    var username = req.url.split('/')[3]
    User.findOne({username:username},function(err, result){
      if (err) {
        console.log("Error finding username:", err);
      } else {
        console.log("Found:", result)
        res.send(result);
      }
    });
  },

  findAllUserTrips: function(req, res, next) {
    console.log("userID", req);
    var userId = req.url.split('/')[4];
    var myTrips = [];
    User.findById({ _id: userId }, function(err, user) {
      if (err) { 
        console.log("findById error", err)
        return err; 
      } else {
        console.log("findbyID Results", trip);
        return user;
      }
    })
    .then(function(user){
      var tripLength = user.trips.length;
      user.trips.forEach(function(tripId){
        Trips.findById({ _id: tripId }, function(err, trip) {
          if (err) {
            console.log("Error finding Trips by tripId", err)
          } else {
            console.log("Found trip", trip)
            myTrips.push(trip);
            if(tripLength === myTrips.length){
              console.log("myTrip:", myTrips)
              res.send(myTrips);
            } 
          }
        });
      });
    });
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

  },

  addTrips : function(req, res, next) {
    var userId = req.url.split('/')[3];
    User.findById({ _id: userId },function(err, result){
      if (err) {
        console.log("Error finding username:", err);
      } else {
        var newTrips = req.body.trips;
        var currentTrips = result.trips;
        newTrips.forEach(function(trip){
          currentTrips.push(trip);
        })
        result.trips = currentTrips;
        result.save(function(err) {
          if (err) {
            console.log(err);
          }
          res.send(result);
        });       
      }
    });
  }
};



     