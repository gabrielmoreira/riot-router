var riot = require('riot');
var route = require('riot-route');
console.log("INIT", route);
riot.route = route;
var router = require('../../router');
riot.router.start();
module.exports = {
  riot: riot,
  router: riot.router
};
