var assert = require('assert'), 
    helper = require('./helper.js'),
    riot = helper.riot;

var Route = riot.router.Route;
var NotFoundRoute = riot.router.NotFoundRoute;
var DefaultRoute = riot.router.DefaultRoute;
var Request = riot.router._.Request;
var Response = riot.router._.Response;

describe('riot.router', function() {
  riot.router.start();
  
  it('can handle riot routes', function() {
    riot.router.route(new Route());
    riot.route('/user/123');
    assert.equal(riot.router.current.uri, '/user/123');
  });
  
});

describe('riot.router.Route', function() {
  it('can extract path parameters', function() {
    var route = new Route({tag: 'user', path: '/user/:id'});
    var request = new Request('/user/123');
    var response = new Response(request);
    assert.ok(route.process(request, response));
    assert.equal(response.size(), 1);
    var matcher = response.get(0);
    assert.equal(matcher.tag, 'user');
    assert.equal(matcher.route, route);
    assert.equal(matcher.params.id, '123');
  });
  
  it('can handle not found routes', function() {
    var route = new Route().routes([
      new Route({tag: 'user', path: '/user/:id'}),
      new NotFoundRoute({tag: 'not-found'})
    ]);
    var request = new Request('/app/test');
    var response = new Response(request);
    assert.ok(route.process(request, response));
    assert.equal(2, response.size());
    var matcher = response.get(1);
    assert.equal(matcher.tag, 'not-found');
  });
  
  it('can handle default routes', function() {
    var route = new Route({path: 'user'}).routes([
      new DefaultRoute({tag: 'user-default'}),
      new Route({tag: 'user', path: '/:id'})
    ]);
    var request = new Request('/user/');
    var response = new Response(request);
    assert.ok(route.process(request, response));
    assert.equal(2, response.size());
    var matcher = response.get(1);
    assert.equal(matcher.tag, 'user-default');
  });
});