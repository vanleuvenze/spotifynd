
//  This controller applies to the createTrip.html
angular.module('app.create', ['app.services','firebase', 'uiGmapgoogle-maps'])
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
  $scope.buttonPressed = false;

  $scope.trips = [];



  //redirect if user isn't validated
  if (!window.localStorage.EQUIP_TOKEN) {
    $location.path('#/signin');
  }
  

  $scope.getUser = function(id){
    ActivitiesData.getUser(id)
      .then(function(user){
        $scope.userInfo = user
        $scope.trips = user.trips
      })
  }

  $scope.addToUserRooms = function(){

    var activities = $scope.itinerary.map(function (activity) {
      return {
        address: activity.address,
        city: activity.city,
        lat: activity.lat,
        lng: activity.lng,
        rating: activity.rating,
        photo: activity.photo,
        url: activity.url
      }
    })


     var tripObj = {
      name: $scope.itineraryName,
      city: $scope.city,
      state: $scope.state,
      activities: activities,
      image: $scope.itineraryImage
      };
      console.log(tripObj)
      ActivitiesData.createTrip(tripObj);

  
    $scope.buttonPressed = true;
    $scope.trips.push({room: $scope.roomId, tripName: $scope.itineraryName})
    var userTrips = {trips: $scope.trips}
    ActivitiesData.updateUser($scope.userId, userTrips)
  }

  $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 14};
  $scope.options = {scrollwheel: false};
  $scope.markers = [];

  $scope.$watchCollection('markers', function(newIt, oldIt) {

  });

  $scope.onClick = function(marker, eventName, model) {
      console.log("Clicked!");
      model.show = !model.show;
  };

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
          console.log('activities', data);
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

    var activity = this.activity;
    $scope.createMarker(activity);
  };

  // <h4>$scope.removeFromTrip</h4>
  // Is a function that removes an item from the users itinerary
  $scope.createMarker = function (activity) {
    var str = 'http://maps.google.com/maps/api/geocode/json?address=';
    console.log(activity);
    var arr = activity.address.split(',');
    for (var i=0; i<arr.length-1; i++) {
      var sub = arr[i].trim().split(' ');
      for (var j=0; j<sub.length-1; j++) {
        str += sub[j] + '+'
      }
      str+= sub[sub.length-1]+','+'+';
    }

    str+=arr[arr.length-1].slice(0,3)+"&sensor=false";
    console.log(str);
    $http.get(str)
    .then(function(results){

      // server calls a get request to the foursquare api
      // posts it to our database
      // gets data back out of our database and returns it
      //address: "59th St to 110th St, New York, NY - US"

      var data = results.data.results[0].geometry.location;
      var marker = {
        id: $scope.markers.length,
        latitude: data.lat,
        longitude: data.lng,
        title: activity.name + "\n" + activity.url,
        show: false,
        templateUrl: 'templates/info.html',
        templateParameter: {
          url: activity.url
        },
        options: {
          labelContent: activity.name,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        },
        events: {
                click: function (marker, eventName, args) {
                }
              }
      };
      
      $scope.map = {center: {latitude: data.lat, longitude: data.lng }, zoom: 14 };
      $scope.markers.push(marker);
      //$scope.$digest();

    })
    .catch(function(err){
      console.log("Error Getting Individual Trip Data: ", err)
    });
  }

  $scope.removeFromTrip = function () {
    var index = $scope.itinerary.indexOf(this.activity);
    $scope.itinerary.$remove(index);
    for (var i=0; i<$scope.markers.length; i++) {
      if ($scope.markers[i].title === this.activity.name + "\n" + this.activity.url) {
        $scope.markers.splice(i, 1);
        break;
      }
    }
    //$scope.$digest();

  };

  // <h4>$scope.saveItinerary</h4>
  // Is a function that creates an object containing all the relevant information to a users itinerary
  // the object is sent to the server and DB through the factory function ActivitiesData.createTrip
  // see the documentation on services.js for more information.
  $scope.saveItinerary = function () {
    // POST request to /trips with $scope.itinerary 

    var tripObj = {
      name: $scope.itineraryName,
      city: $scope.city,
      state: $scope.state,
      activities: $scope.itinerary,
      image: $scope.itineraryImage
    };

    console.log(tripObj, $scope.itinerary);

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
    var length = 0;
    var location = snap.val();
      ActivitiesData.getActivities(location)
        .then(function (data) {
          $scope.activities = data.data;
        })
    })
    $scope.messages = Fire.addMessage($scope.roomId)
    $scope.itinerary = Fire.addToPlaylist($scope.roomId);
    console.log($scope.itinerary[1]);
    $scope.itinerary.$loaded()
      .then(function (itinerary) {
        if (itinerary.length>0) {
          for (var i=0; i<itinerary.length; i++) {
            var act = itinerary[i];
            $scope.createMarker(act);
          }
        }
      })
      .catch(function (err) {

    });

    $scope.topLevelCompleted = true;
    $scope.formCompleted = true;
  }

  $scope.addMessage = function(message){
    console.log($scope.userInfo.username);
    $scope.messages.$add({user: $scope.userInfo.username, message: $scope.message});
  }

  $scope.logOut = function(){
    $window.localStorage.removeItem('EQUIP_TOKEN');
    $location.path('/')
  }
});