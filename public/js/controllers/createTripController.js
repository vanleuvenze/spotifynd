
//  This controller applies to the createTrip.html
angular.module('app.create', ['app.services','firebase'])
.constant('FIREBASE_URI', "https://spotyfind.firebaseio.com/")
//  Factory functions are loaded in in 'ActivitiesData' from 'app.services'
.controller('CreateTripController', function ($scope, $http, ActivitiesData, Fire, FIREBASE_URI, $firebaseArray, $window, $location) {
  
  // $scope.formCompleted is a variable to determine if the form is completed
  // if it's false, the form with show
  // if true, the form will hide and the right side of page will populate
  $scope.userId = $window.localStorage.getItem('EQUIP_TOKEN')
  $scope.userInfo = {};
  $scope.formCompleted = false;
  $scope.topLevelCompleted = false;
  $scope.trips = [];
  
  $scope.getUser = function(id){
    ActivitiesData.getUser(id)
      .then(function(user){
        $scope.user = user
        $scope.trips = user.trips
      })
  }
   // <h3>startItinerary is a function to: </h3>
    // 1. hide the form
    // 2. trigger the search
  $scope.startItinerary = function () {
    console.log('start itinerary');

    if (!$scope.itineraryName || !$scope.city || !$scope.state) {
      return;
    } else {
      //city url to update settings with
      var cityUrl = $scope.city + ',' + $scope.state;

      // remove the form - replace with playlist constructor
      $scope.formCompleted = true;

      //update settings;
      var settings = new Firebase(FIREBASE_URI + $scope.roomId + '/settings')
      settings.update({'location' : cityUrl, 'createdAt': Firebase.ServerValue.TIMESTAMP});

      ActivitiesData.getActivities(cityUrl)
        .then(function (data) {
          $scope.activities = data.data;
        })
    }
 
  };

  // $scope.itinerary is an emtpy array that will contain all the activities the user will add
  // to their trip
  // $scope.itinerary = []; 

  // <h4>$scope.addToTrip</h4> 
  // Is a function that that adds an activity from the api to the users itinerary
  $scope.addToTrip = function(){
    // The first item added to the itinerary will be the item whose photo is stored with the trip
    if ($scope.itinerary.length === 0) {
      $scope.itineraryImage = this.activity.photo;
    }
    $scope.itinerary.$add(this.activity);
  };

  // <h4>$scope.removeFromTrip</h4>
  // Is a function that removes an item from the users itinerary
  $scope.removeFromTrip = function () {
    var index = $scope.itinerary.indexOf(this.activity);
    $scope.itinerary.$remove(index);
  };

  // <h4>$scope.saveItinerary</h4>
  // Is a function that creates an object containing all the relevant information to a users itinerary
  // the object is sent to the server and DB through the factory function ActivitiesData.createTrip
  // see the documentation on services.js for more information.
  $scope.saveItinerary = function () {
    // POST request to /trips with $scope.itinerary 
    var activityIds = $scope.itinerary.map(function (activity) {
      return activity._id;
    });
    console.log("ACTIVITY:", activityIds);
    var tripObj = {
      name: $scope.itineraryName,
      city: $scope.city,
      state: $scope.state,
      activities: activityIds,
      image: $scope.itineraryImage
    };
    var trip = JSON.stringify(tripObj);
    ActivitiesData.createTrip(trip);
  };
  
  //messages controller:
  $scope.addRoom = function () {
    var room = Fire.addRoom();
    $scope.roomId = room.key();
    $scope.messages = Fire.addMessage($scope.roomId);
    $scope.itinerary = Fire.addToPlaylist($scope.roomId);
    $scope.topLevelCompleted = true;
    
      // make our settings available
    $scope.settings = new Firebase(FIREBASE_URI + $scope.roomId +'/settings');
  }
  $scope.getRoom = function(id){
    $scope.roomId = id
    var room = Fire.getRoom(id);
    var settings = room.child('/settings/location').on('value', function (snap) {
    var location = snap.val();
      ActivitiesData.getActivities(location)
        .then(function (data) {
          $scope.activities = data.data;
        })
    })
    $scope.messages = Fire.addMessage($scope.roomId)
    $scope.itinerary = Fire.addToPlaylist($scope.roomId);
    $scope.topLevelCompleted = true;
    $scope.formCompleted = true;
  }

  $scope.addMessage = function(message){
    $scope.messages.$add({user: $scope.username, message: $scope.message});
  }

  $scope.logOut = function(){
    $window.localStorage.removeItem('EQUIP_TOKEN');
    $location.path('/')
  }
});