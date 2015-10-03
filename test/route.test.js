var assert = require('assert'),
    helper = require('./support/helper'),
    riot = helper.riot;

var Route = riot.router.Route;
var NotFoundRoute = riot.router.NotFoundRoute;
var DefaultRoute = riot.router.DefaultRoute;
var Request = riot.router._.Request;
var Response = riot.router._.Response;


describe('riot.route', function() {
  before(function () {
    var route = document.createElement('route');
    document.body.appendChild(route);

    riot.mount('route');
    riot.router.routes([
      new Route({tag: 'static'}),
      new Route({path: '/dynamic', tag: function () { return 'dynamic'; }}),
      new Route({path: '/dynamic-api', tag: function () {
        return {tag: 'dynamic-api', api: {}};
      }})
    ]);
  });

  it('works with static tags', function() {
    riot.route('/static');
    assert.ok(document.querySelector('static'));
  });

  it('works with dynamic tags', function() {
    riot.route('/dynamic');
    assert.ok(document.querySelector('dynamic'));
  });

  it('works with dynamic tags and api', function() {
    riot.route('/dynamic-api');
    assert.ok(document.querySelector('dynamic-api'));
  });
});
