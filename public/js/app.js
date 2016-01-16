// app is called app
// app.auth loads authentication controller
// app.trip loads the tripViewController
// app.landing loads the landing controller
// app.create loads the createTrip controller
// app.services loads all factory/service functionality
// app.mytrips loads myTrips controller
// ngRoute is for angular routing
angular.module('app', ['firebase', 'app.auth', 'app.trip', 'app.landing', 'app.create', 'app.services', 'app.mytrips', ,'app.message', 'app.explore', 'ngRoute', 'ngMaterial', 'ngAria','luegg.directives','uiGmapgoogle-maps'])

.config(function ($routeProvider) {
  $routeProvider
    .when('/explore', {
      templateUrl: './js/templates/explore.html',
      controller: 'ExploreController'
    })
    .when('/signin', {
      templateUrl: './js/templates/signup.html',
      controller: 'AuthController'
    })

    .when('/myTrips', {
      templateUrl: './js/templates/mytrips.html',
      controller: 'MyTripsController'
    })
    // splash page
    .when('/', {
      templateUrl: './js/templates/splash.html',
    })
    // single trip page
    .when('/room', {
      templateUrl: './js/templates/colab.html',
      controller: 'CreateTripController'
    })
    .otherwise('/signin');
});