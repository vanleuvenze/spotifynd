angular.module('app.auth', ['app.services'])

// Auth is a factory/service from app.services
.controller('AuthController', function ($scope, $http, $location, Auth) {

  

  $scope.signUp = function () { 
    var data = {
      username: $scope.signUpUsername,
      password: $scope.signUpPassword
    }

    Auth.signUp(data)
      .then(function (data) {
        $location.path('/room');
        console.log('good post', data);
      })
      .catch(function (err) {
        console.log('error', err);
      });
  };

  $scope.signIn = function () {
    console.log('signing in', $scope.username, $scope.password);
    Auth.signIn($scope.username, $scope.password)
    .then(function (data) {
      console.log($scope.user)
      $scope.aab = 'hello'
      console.log($scope.user)
      window.localStorage.setItem('EQUIP_TOKEN', data.data.id);
      $location.path('/room');
    });

  };

  $scope.isLoggedIn = function(){
    var token = window.localStorage.getItem('EQUIP_TOKEN')
    if(token){
      $location.path('/room')
    }
  }

  $scope.redirectLogin = function () {
    $location.path('/login');
  };

  $scope.redirectSignup = function () {
    $location.path('/signup');
  }



  // <h4>$scope.login</h4>
  // login function to be called when login input form submitted
  // $scope.login = function (user) {
  //   $scope.error = '';
    
  //   var userData = {
  //     "username":$scope.username,
  //     "password":$scope.password
  //   }; 
  //   console.log("Attempting to login", userData)
  //   // <h4> Auth.login </h4>
  //   // Is a function that posts to /login to log the user in
  //   Auth.login(userData)
  //     .then(function(message){
  //         $scope.clearFields();
  //         $scope.error = message;
  //     })
  // };


  // <h4> Auth.signup </h4>
  // Is a function that posts to /signup to sign up
  // sign up function to be called when input form submitted
  // $scope.signup = function () {
  //   $scope.signUpError = '';
  //   var userData = {
  //     "username":$scope.signUpUsername,
  //     "password":$scope.signUpPassword
  //   }
  //   console.log('User entered signup data',userData)
  //   // <h4> Auth.signup </h4>
  //   // Is a function that posts to /signup to log the user in
  //   Auth.signup(userData)
  //   .then(function(message){
  //     $scope.clearFields();
  //     $scope.signUpError = message;
  //   })
  // };

  // <h4>$scope.clearFields</h4>
  // function that clears all the text input fields
  $scope.clearFields = function (){
    $scope.signUpUsername='';
    $scope.signUpPassword='';
    $scope.username='';
    $scope.password='';
  };
})
