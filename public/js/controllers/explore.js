angular.module('app.explore', ['ngMaterial', 'app.services'])
  .controller('ExploreController', function ($scope, $location, ActivitiesData) {


  	ActivitiesData.getTrips()
  		.then(function (data) {
  			$scope.trips = data;
  			console.log($scope.trips)
  		})

  	$scope.redirectToLogin = function () {
  		$location.path('/signin')
  	}
  	$scope.redirectToRoom = function () {
  		$location.path('/room')
  	}
  })