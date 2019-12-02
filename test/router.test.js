var assert = require('assert'),
    helper = require('./support/helper');
var riot = helper.riot,
    router = helper.router,
    Router = helper.Router;

var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Request = Router._.Request;
var Response = Router._.Response;


describe('router', function() {
  it('can handle riot routes', function() {
    router.route(new Route({tag: 'user', path: '/user/:id'}));
    router.navigateTo('/user/123');
    assert.equal(router.current.matches[0].tag, 'user');
    assert.equal(router.current.uri, '/user/123');
  });

  it('.updatable prop is `true` by default', function () {
    assert.equal(router.config.updatable, true);
  });

  it('.updatable prop can be reassigned during initialization', function () {
    var newRouter = Router.create({route: helper.route, updatable: 'YES'});
    assert.equal(newRouter.config.updatable, 'YES');
  });
});

describe('router.Route', function() {

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

  it('can extract encoded path parameters', function() {
    var route = new Route({tag: 'user', path: '/user/:name'});
    var request = new Request('/user/Jòsé%26');
    var response = new Response(request);
    assert.ok(route.process(request, response));
    assert.equal(response.size(), 1);
    var matcher = response.get(0);
    assert.equal(matcher.tag, 'user');
    assert.equal(matcher.route, route);
    assert.equal(matcher.params.name, 'Jòsé&');
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

  it('can intercept & redirect route', function(done) {
    var userIsLogged = false;
    router.use(function(request, response, next) {
      try {
        return next();
      } finally {
        if (request.uri != '/redirected')
          response.redirectTo = '/redirected';
      }
    });
    router.exec();
    router.routes([
      new Route({tag: 'user', path: '/user/:id', secure: true}),
      new Route({tag: 'redirected'})
    ]);
    router.on('route:updated', function () {
      try {
        assert.equal('/redirected', router.current.uri);
        assert.equal('redirected', router.current.get(1).tag);
        done();
      } catch (e) {
        done(e);
      }
    });
    router.navigateTo('/user/123');
  });

  it('can extract multiple path parameters', function() {
    var route = new Route({tag: 'user', path: '/user/:id/:name'});
    var request = new Request('/user/123/Gabriel');
    var response = new Response(request);
    assert.ok(route.process(request, response));
    assert.equal(response.size(), 1);
    var matcher = response.get(0);
    assert.equal(matcher.tag, 'user');
    assert.equal(matcher.route, route);
    assert.equal(matcher.params.id, '123');
    assert.equal(matcher.params.name, 'Gabriel');
  });
});

