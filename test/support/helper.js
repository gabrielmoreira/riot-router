var riot = require('riot');
var route = require('riot-route');
var Router = require('../../src/router');
var router = Router.create({route: route});
router.start();

module.exports = {
  riot: riot,
  router: router,
  Router: Router,
  route: route,
};
