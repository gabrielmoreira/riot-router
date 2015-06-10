var riot = require('riot');  
var error = console && console.error || function() {};

class Router {
  constructor() {
    riot.router = this;
    riot.observable(this);
    this.handler = new Route();
    this.current = new Response(new Request(""));
    this.handleRequest = this.handleRequest.bind(this);
  }

  route(handler) {
    this.handler = handler;
  }

  process(request) {
    var response = new Response(request);
    this.handler.process(request, response);
    this.current = response;
    this.trigger('route:updated', response);
    return response;
  }

  handleRequest() {
    var params = Array.prototype.slice.call(arguments);
    this.process(new Request(params.join("/")));
  }

  start() {
    riot.route(this.handleRequest);
    riot.route.start();
    riot.route.exec(this.handleRequest);
  }
}

class Handler {
  constructor() {
  }

  matches(request) {
    return false;
  }

  process(request, response) {
    var matcher = this.matches(request);
    if (!matcher) return this.processNotMatch(request, response);
    return this.processMatch(request, response, matcher);
  }

  processMatch(request, response, matcher) {
    response.add(matcher);
    return true;
  }

  processNotMatch(request, response) {
    return false;
  }

  processRoutes(request, response, routes) {
    if (routes && routes.length) {
      var t = routes.length;
      for(var i = 0; i < t; i++) {
        var route = routes[i];
        if (route.process(request, response))
          return true;
      }
      return false;
    }
  }
}

class Route extends Handler {
  constructor(options) {
    super(options);
    options = options || {};
    this.tag = options.tag;
    this.path = options.path;
    this.name = options.name;
    this.pathParameterNames = [];
    this.pattern = "^/?" + (this.path || this.name || "").replace(/^\//,"").replace(/:([^/]+)/, function(ignored, group) {
      this.pathParameterNames.push(group);
      return "([^/]+)";
    }.bind(this)) + "(:?/|$)";
    this.regex = new RegExp(this.pattern);
  }

  routes(routes) {
    var redirectRoutes = routes.filter(function(r) { return r instanceof RedirectRoute; });
    var defaultRoutes = routes.filter(function(r) { return r instanceof DefaultRoute; });
    var notFoundRoutes = routes.filter(function(r) { return r instanceof NotFoundRoute; });
    var otherRoutes = routes.filter(function(r) { return redirectRoutes.indexOf(r) === -1 
                                                      &&  defaultRoutes.indexOf(r) === -1
                                                      && notFoundRoutes.indexOf(r) === -1; });
    if (notFoundRoutes.length > 1) error("Can't use more than one NotFoundRoute per route. --> " + (this.name || this.path || this.tag));
    if (defaultRoutes.length > 1) error("Can't use more than one DefaultRoute per route. --> " + (this.name || this.path || this.tag));
    this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
    return this;
  }

  matches(request) {
    var matcher = this.regex.exec(request.uri);
    if (matcher) {
      var params = {};
      for (var i in this.pathParameterNames) {
        var name = this.pathParameterNames[i];
        params[name] = matcher[parseInt(i, 10) + 1];
      }
      return {route: this, tag: this.tag, found: matcher[0], params: params};
    }
    return false;
  }

  processMatch(request, response, matcher) {
    var matches = super.processMatch(request, response, matcher);
    this.processRoutes(request, response, matcher);
    return matches;
  }

  processRoutes(request, response, matcher) {
    return super.processRoutes(new RouteChildRequest(request, matcher), response, this._routes);
  }
}

class RouteChildRequest {
  constructor(request, matcher) {
    this.request = request;
    this.matcher = matcher;
    this.uri = this.request.uri.substring(matcher.found.length);
    this.parentUri = this.request.uri.substring(0, matcher.found.length);
  }
}

class NotFoundRoute extends Handler {
  constructor(options) {
    super(options);
    options = options || {};
    this.tag = options.tag;
  }
  matches(request) {
    return {route: this, tag: this.tag, found: request.uri};
  }
}

class RedirectRoute extends Handler {
  
  constructor(options) {
    super(options);
    options = options || {};
    this.from = options.from;
    this.to = options.to;
    this.pattern = "(^/?)" + this.from + "(/|$)";
    this.regex = new RegExp(this.pattern);
  }
  
  process(request, response) {
    var uri = request.uri.replace(this.regex, "$1" + this.to + "$2");
    if (uri !== request.uri) {
      var parent = request.parentUri || "";
      // Rewrite response.uri & request.uri
      response.uri = parent + uri;
      request.uri = uri;
    }
  }
  
}

class DefaultRoute extends Handler {
  constructor(options) {
    super(options);
    options = options || {};
    this.tag = options.tag;
  }
  matches(request) {
    var uri = request.uri.trim();
    if (uri === "/" || uri === "")
      return {route: this, tag: this.tag, found: uri};
  }
}

class Request {
  constructor(uri) {
    this.uri = uri;
  }
}

class Response {
  constructor(request) {
    this.uri = request.uri;
    this.matches = [];
    this.params = {};
  }
  add(matcher) {
    this.matches.push(matcher);
    var params = matcher.params;
    if (params) {
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          this.params[key] = params[key];
        }
      }
    }
  }

  get(index) {
    return this.matches[index];
  }

  size() {
    return this.matches.length;
  }

  isEmpty() {
    return this.matches.length;
  }
}

riot.tag('route-empty', '', function(opts) {
});

riot.tag('route', '<route-content name="content"></route-content>', function(opts) {
  this.calculateLevel = function(target) {
    var level = 0;
    if (target.parent) level += this.calculateLevel(target.parent);
    if (target.opts.__router_level) level += target.opts.__router_level;
    if (target.__router_tag) level += 1;
    return level;
  }.bind(this);

  this.mountTag = function(tag, api) {
    if (this.instance)
      this.instance.forEach(function(instance) {
        instance.unmount(true);
      });
    if (tag)
      this.instance = riot.mount(this.root.children[0], tag, api);
  }

  this.updateRoute = function() {
    var mount = {tag: 'route-empty'};
    if (riot.router && riot.router.current) {
      var response = riot.router.current;
      if (this.level <= response.size()) {
        var matcher = response.get(this.level);
        if (matcher) {
          var api = JSON.parse( JSON.stringify( matcher.params || {} ) );
          api.__router_level = this.level;
          mount = {tag: matcher.tag, api: api};
        }
      }
    }
    this.mountTag(mount.tag, mount.api);
  }.bind(this);

  this.__router_tag = 'route';
  this.level = this.calculateLevel(this);
  riot.router.on('route:updated', this.updateRoute);

  this.on('unmount', function() {
    riot.router.off('route:updated', this.updateRoute);
  }.bind(this));

});

var router = new Router();
router.Route = Route;
router.DefaultRoute = DefaultRoute;
router.RedirectRoute = RedirectRoute;
router.NotFoundRoute = NotFoundRoute;
router._ = {Response: Response, Request: Request};

riot.router = router;
