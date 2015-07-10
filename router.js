var riot = require('riot');  
var extend = require('extend');
var error = console && console.error || function() {};

class Router {

  constructor() {
    riot.router = this;
    riot.observable(this);
    this.interceptors = [this.processRoute.bind(this)];
    this.handler = new InitialRoute();
    this.current = new Context("").response;
    this.process = this.process.bind(this);
  }

  route(handler) {
    this.handler = handler;
  }
  
  routes(routes) {
    this.route(new Route().routes(routes));
  }

  use(interceptor) {
    this.interceptors.push(interceptor);
  }

  process() {
    var params = Array.prototype.slice.call(arguments);
    var context = new Context(params.join("/"));
    this.processRequest(context);
    return context;
  }

  processRequest(context) {
    this.processInterceptors(context);
    return this.processResponse(context);
  }

  processResponse(context) {
    if (this.isRedirect(context)) {
      return this.processRedirect(context);
    }
    var {request, response} = context;
    if (!response.redirectTo) {
      this.current = response;
      this.trigger('route:updated', response);
      return context;
    }
  }

  isRedirect(context) {
    return !!context.response.redirectTo;
  }

  processRedirect(context) {
    context.redirectTo(context.response.redirectTo);
    return this.processRequest(context);
  }

  processInterceptors(context, preInterceptors, postInterceptors) {
    var interceptors = (preInterceptors || []).concat(this.interceptors).concat(postInterceptors || []);
    var next = function next() {
      if (!context.stop) {
        var processor = interceptors.shift();
        var {request, response} = context;
        if (processor)
          return processor(request, response, next, context);
      }
      return context;
    };
    return next();
  }

  processRoute(request, response, next, context) {
    this.handler.process(request, response, context);
    return next();
  }

  start() {
    riot.route(this.process);
    riot.route.start();
    this.exec();
  }

  exec() {
    riot.route.exec(this.process);
  }
}

class Context {
  constructor(request) {
    this.request = typeof(request) === 'string' ? new Request(request) : request;
    this.response = new Response(this.request);
    this.redirectStack = [];
  }

  redirectTo(uri) {
    if (this.redirectStack.indexOf(uri) > -1)
      throw new Error("Cyclic redirection to " + uri + ". Stack = " + this.redirectStack);
    this.redirectStack.push(uri);
    this.request = new Request(uri);
    this.response = new Response(this.request);
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

  createRequest(request, matcher) {
    return new ChildRequest(request, matcher);
  }
}

class Route extends Handler {
  constructor(options) {
    super(options);
    options = options || {};
    this.tag = options.tag;
    this.api = options.api;
    this.path = options.path;
    this.name = options.name;
    this.pathParameterNames = [];
    var path = (this.path || this.name || this.tag || "").replace(/^\//,"");
    this.pattern = "^/?" + path.replace(/:([^/]+)/g, function(ignored, group) {
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
      return {route: this, tag: this.tag, api: this.api, found: matcher[0], params: params};
    }
    return false;
  }

  processMatch(request, response, matcher) {
    var matches = super.processMatch(request, response, matcher);
    this.processRoutes(request, response, matcher);
    return matches;
  }

  processRoutes(request, response, matcher) {
    return super.processRoutes(super.createRequest(request, matcher), response, this._routes);
  }
}

class InitialRoute extends Route {
  processMatch() {
    return true;
  }

  processRoutes(request, response, matcher) {
    return super.processRoutes(request, response, this._routes);
  }
}

class ChildRequest {
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
    this.api = options.api;
  }
  matches(request) {
    return {route: this, tag: this.tag, api: this.api, found: request.uri};
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
    this.api = options.api;
  }
  matches(request) {
    var uri = request.uri.trim();
    if (uri === "/" || uri === "")
      return {route: this, tag: this.tag, api: this.api, found: uri};
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

riot.tag('route', '<router-content></router-content>', function(opts) {
  this.calculateLevel = function(target) {
    var level = 0;
    if (target.parent) level += this.calculateLevel(target.parent);
    if (target.opts.__router_level) level += target.opts.__router_level;
    if (target.__router_tag) level += 1;
    return level;
  }.bind(this);

  this.unmountTag = function() {
    if (this.instance)
      this.instance.forEach(function(instance) {
        instance.unmount(true);
      });    
  }
  
  this.mountTag = function(tag, api) {
    this.unmountTag();
    if (tag) {
      this.root.replaceChild(document.createElement(tag), this.root.children[0]);
      this.instance = riot.mount(this.root.children[0], tag, api);
    }
  }

  this.updateRoute = function() {
    var mount = {tag: null};
    if (riot.router && riot.router.current) {
      var response = riot.router.current;
      if (this.level <= response.size()) {
        var matcher = response.get(this.level);
        if (matcher) {
          var params = matcher.params || {};
          var api = extend(true, {}, matcher.api, params, {__router_level: this.level});
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
    this.unmountTag();
  }.bind(this));

});

var router = new Router();
router.Route = Route;
router.DefaultRoute = DefaultRoute;
router.RedirectRoute = RedirectRoute;
router.NotFoundRoute = NotFoundRoute;
router._ = {Response: Response, Request: Request};

riot.router = router;

module.exports = router;
