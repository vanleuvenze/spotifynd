//== Hooking in to firebase with Using Angular Fire ==

// --Spotifynd
//            |room1+
//            |
//            |room2__
//                    |__Messages - [ firebase array ]
//                    |
//                    |__Playlist - [ firebase array ]

//these firebase arrays will sync data between our $scope and firebase, so any changes $messages, for example, will be reflected in firebase.

//below, the creation of firebase array references is delegated to the Fire service.  in the Spotifynd.control controller, we use these functions to initialize this 'binding' between $scope and our array instances ($messages and $playlist)



var app = angular.module('Spotifynd', ['firebase', 'ui.router']);
	
app.constant('FIREBASE_URI', "https://spotyfind.firebaseio.com/");

app.controller('Spotifynd.control', [
  "$scope",
  'Fire',
  '$firebaseArray',
  function ($scope, Fire, $firebaseArray) {

  //THREE WAY DATA BINDING LOL
	$scope.addRoom = function () {
		var room = Fire.addRoom();
    $scope.roomId = room.key();
    $scope.messages = Fire.addMessage($scope.roomId);
    $scope.playlist = Fire.addToPlaylist($scope.roomId);
	}

	$scope.addMessage = function () {
    //adding a message to our firebaseArray bound $scope.messages - remember, this will sync with firebase
    $scope.messages.$add({user: $scope.username, message: $scope.message});
  }

  $scope.addToPlaylist = function () {

    //we need to grab some kind of identifier off of the click event in order to make the transition from the 'trip items' area, to the 'playlist' area
    $scope.playlist.$add({})
  }

  $scope.removeFromPlaylist = function () {

    //again, need to grab some kind of identifier off of the click event in order to remove the trip item from the playlist category, preferably an index.
    $scope.messages.$remove('some record key');
  }


  $scope.getTripData = function () {
    //not sure exaclty how this will work yet - in terms of how firebase will store this big hunka hunka data
    $scope.tripData = Fire.getTripData();
  }
	
}])

app.factory('Fire', [
  '$http',
  '$firebaseArray',
  '$firebase',
  'FIREBASE_URI',
  function ($http, $firebaseArray, $firebase, FIREBASE_URI) {

    var ref = new Firebase(FIREBASE_URI);

    var getTripData = function (city) {
      var ref = new Firebase(FIREBASE_URI + 'tripData');

      $http({
        method: 'GET',
        url: "http://127.0.0.1:8080/api/activities " + 'hook it up Dan!'
      })
      .then(function (data) {
        ref.set(data)
      })
      return ref;
    }

    var addRoom = function () {
      var newRoom = ref.push({
        messages: [{user:'Spotifynd', message: 'Welcome!'}],
        playlist: [],
        tripData: []
      })
      return newRoom;
    }

    var addMessage = function (id) {
      // create a reference to the database where we will store our data
      //when we add a message we need to find the cu
      var ref = new Firebase(FIREBASE_URI + id + '/messages');

      return $firebaseArray(ref);
      
    }

    var addToPlaylist = function (id) {
      //
      var ref = new Firebase(FIREBASE_URI + id + '/playlist');

      return $firebaseArray(ref);
    }

    return {
      addRoom: addRoom,
      addMessage: addMessage,
      addToPlaylist: addToPlaylist,
      getTripData: getTripData
    }
}])



