var riot = require('riot');

require('./function-bind');
require('../../lib/router');

riot.router.start();

module.exports = {
  riot: riot,
  router: riot.router
};
