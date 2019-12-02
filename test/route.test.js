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

riot.tag('need-data', '<span>{ opts.someData }</span>', function (opts) {
});

describe('route scenarios', function() {
  var tag;
  var someData = 'the data i need';

  before(function () {
    var route = document.createElement('route');
    route.setAttribute('some-data', someData);
    document.body.appendChild(route);
    tag = riot.mount('route')[0];
    router.routes([
      new Route({tag: 'static'}),
      new Route({tag: 'need-data'}),
      new Route({path: '/dynamic', tag: function () { return 'dynamic'; }}),
      new Route({path: '/dynamic-api', tag: function () {
        return {tag: 'dynamic-api', api: {}};
      }})
    ]);
    router.start();
  });

  describe('<route> tag -> route.canUpdate method', function () {
    it('should return false when updatable = false', function() {
      assert.equal(tag.canUpdate('route', {}, { updatable: false }), false);
    });

    it('should return false when updatable = true AS updatable is ignored without prior config', function() {
      assert.equal(tag.canUpdate('route', {}, { updatable: true }), false);
    });

    it('should return false when no arguments passed', function() {
      assert.equal(tag.canUpdate(null, {}, {}), false);
    });
  });

  describe('router.navigateTo (test is not working...)', function () {
    it('works with static tags', function() {
      router.navigateTo('/static');
      assert.ok(document.querySelector('static'));
    });

    it('works with dynamic tags', function() {
      router.navigateTo('/dynamic');
      assert.ok(document.querySelector('dynamic'));
    });

    it('works with dynamic tags and api', function() {
      router.navigateTo('/dynamic-api');
      assert.ok(document.querySelector('dynamic-api'));
    });

    it('passes data to the mounted tag', function() {
      router.navigateTo('/need-data');
      assert.equal(tag.instance.opts.someData, someData);
    });
  });
});
