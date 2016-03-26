var assert = require('assert'),
    helper = require('./support/helper'),
    riot = helper.riot;

var Route = riot.router.Route;
var NotFoundRoute = riot.router.NotFoundRoute;
var DefaultRoute = riot.router.DefaultRoute;
var Request = riot.router._.Request;
var Response = riot.router._.Response;

riot.tag('need-data', '<span>{ opts.someData }</span>', function (opts) {
});


describe('riot.route', function() {
  var tag;
  var someData = 'the data i need';

  before(function () {
    var route = document.createElement('route');
    route.setAttribute('some-data', someData);
    document.body.appendChild(route);

    tag = riot.mount('route')[0];
    riot.router.routes([
      new Route({tag: 'static'}),
      new Route({tag: 'need-data'}),
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

  it('passes data to the mounted tag', function() {
    riot.route('/need-data');
    assert.equal(tag.instance.opts.someData, someData);
  });
});
