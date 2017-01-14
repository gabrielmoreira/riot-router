var riot = require('riot');
var route = require('riot-route');
var Router = require('./src/router.js');
var router = Router.create({route: route});
if (window) {
    window.router = router;
}
module.exports = Router;

