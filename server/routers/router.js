var controller = require('../controllers/controller.js');
var userController = require('../controllers/userController.js');
//var dbController = require('../models/dbroutes.js');

module.exports = function(app, express) {

  //####### Documentation in Controller 
  app.post('/api/login', userController.login);
  app.post('/api/signup', userController.signup);
  app.get('/api/logout', userController.logout);

  app.get('/api/activities/*', controller.searchStoredData, controller.fetchCityData);
  app.post('/api/trips', controller.createTrip);
  app.get('/api/trips/:id', controller.accessTrip);
  app.get('/api/trips', controller.getAllTrips);

  app.put('/api/user/:id', userController.updateUserTrips);
  app.get('/api/user/:id', userController.getUser);

 //###### Live but not used in production############
  // app.get('/api/user/*', userController.findUser);

  function restrict(req, res, next) { 
    if (req.session.user) {
      next();
    } else {                  
      req.session.error = 'Access denied!';
      res.redirect('/api/login');
    }
  }


  //############Pending Routes#####################
  // app.get('/api/user/*/*', userController.findOneUserTrip);
  // app.get('/user', controller.checkAuth);
  // app.get('/activities/*', controller.fetchCityData);
  // app.get('/db/activities', dbController.retrieveActivities);
  // app.post('/db/activities', dbController.storeActivities);
  // app.delete('/trips', controller.deleteTrip);

}