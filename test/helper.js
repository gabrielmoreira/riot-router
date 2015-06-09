var riot = require('riot');

(function(exports) {
  var _route = function() {};
  var _parser = function parser(path) {return path.split('/')};
  
  riot.route = function(route) {
    if (route && route[0])
      _route.apply(null, _parser(route));
    else
      _route = route;
  }
  riot.route.start = function() {};
  riot.route.exec = function(_route) {};
  exports.riot = riot;
  
})(global);

require('../router.js');


module.exports = {
  riot: riot,
  router: riot.router,
}