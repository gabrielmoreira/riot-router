var riot = require('riot');
var extend = require('extend');
var error = console && console.error || function () {};

class Router {
  constructor() {
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
    this.route(new InitialRoute().routes(routes));
  }

  use(interceptor) {
    this.interceptors.push(interceptor);
  }

  process() {
    var params = Array.prototype.slice.call(arguments);
    var query = {};
    var uri = params.filter(function (p) {
      if (typeof (p) !== 'string') {
        query = p;
        return false;
      }
      return true;
    }).join("/");
    if (uri[0] !== '/') uri = "/" + uri; // handle '#any' as '#/any'
    var context = new Context(new Request(uri, query));
    if (!this.rootContext) this.rootContext = context;
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
    var {
      request,
      response
    } = context;
    if (!response.redirectTo) {
      this.current = response;
      this.rootContext = null;
      this.trigger('route:updated', response);
      return context;
    }
  }

  isRedirect(context) {
    return !!context.response.redirectTo;
  }

  processRedirect(context) {
    var uri = context.response.redirectTo;
    var shouldReplace = Boolean(context.response.shouldReplace);
    this.rootContext.addRedirect(uri);
    this.navigateTo(uri, shouldReplace);
  }

  navigateTo() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof(args[1]) === 'boolean') {
      args.splice(1, 0, '');
    }
    this.config.route.apply(null, args);
  }

  processInterceptors(context, preInterceptors, postInterceptors) {
    var interceptors = (preInterceptors || []).concat(this.interceptors).concat(postInterceptors || []);
    var next = function next() {
      if (!context.stop) {
        var processor = interceptors.shift();
        var {
          request,
          response
        } = context;
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
    this.config.route.start();
    this.exec();
  }

  exec() {
    this.config.route.exec(this.process);
  }

  configure(options) {
    this.config = extend(true, {}, this.config, options);
    if (this.config.route.parser && this.config.parser)
      this.config.route.parser(this.config.parser);
    if (this.config.route.base && this.config.base)
      this.config.route.base(this.config.base);
    this.config.route(this.process);
  }

}

class Context {
  constructor(request) {
    this.request = typeof (request) === 'string' ? new Request(request) : request;
    this.response = new Response(this.request);
    this.redirectStack = [];
  }

  addRedirect(uri) {
    if (this.redirectStack.indexOf(uri) > -1)
      throw new Error("Cyclic redirection to " + uri + ". Stack = " + this.redirectStack);
    this.redirectStack.push(uri);
  }

}

class Handler {
  constructor() {}

  matches(request) {
    return false;
  }

  process(request, response) {
    var matcher = this.matches(request);
    if (!matcher) return this.routeMiss(request, response);
    return this.routeMatch(request, response, matcher);
  }

  routeMatch(request, response, matcher) {
    response.add(matcher);
    return true;
  }

  routeMiss(request, response) {
    return false;
  }

  processRoutes(request, response, routes) {
    if (routes && routes.length) {
      var t = routes.length;
      for (var i = 0; i < t; i++) {
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
    this.updatable = options.updatable;
    this.pathParameterNames = [];
    var path = this.getPath().replace(/^\//, "");
    this.pattern = "^/?" + path.replace(/:([^/]+)/g, function (ignored, group) {
      this.pathParameterNames.push(group);
      return "([^/]+)";
    }.bind(this)) + "(:?/|$)";
    this.regex = new RegExp(this.pattern);
  }

  routes(routes) {
    var redirectRoutes = routes.filter(function (r) {
      return r instanceof RedirectRoute;
    });
    var defaultRoutes = routes.filter(function (r) {
      return r instanceof DefaultRoute;
    });
    var notFoundRoutes = routes.filter(function (r) {
      return r instanceof NotFoundRoute;
    });
    var otherRoutes = routes.filter(function (r) {
      return redirectRoutes.indexOf(r) === -1 &&
        defaultRoutes.indexOf(r) === -1 &&
        notFoundRoutes.indexOf(r) === -1;
    });
    if (notFoundRoutes.length > 1) error("Can't use more than one NotFoundRoute per route. --> " + this.getPath());
    if (defaultRoutes.length > 1) error("Can't use more than one DefaultRoute per route. --> " + this.getPath());
    this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
    return this;
  }

  matches(request) {
    var matcher = this.regex.exec(request.uri);
    if (matcher) {
      var params = {};
      for (var i in this.pathParameterNames) {
        if (this.pathParameterNames.hasOwnProperty(i)) {
          var name = this.pathParameterNames[i];
          params[name] = decodeURIComponent(matcher[parseInt(i, 10) + 1]);
        }
      }
      return {
        route: this,
        tag: this.tag,
        api: this.api,
        found: matcher[0],
        params: params
      };
    }
    return false;
  }

  routeMatch(request, response, matcher) {
    var matches = super.routeMatch(request, response, matcher);
    this.processRoutes(request, response, matcher);
    return matches;
  }

  processRoutes(request, response, matcher) {
    return super.processRoutes(this.createRequest(request, matcher), response, this._routes);
  }

  getPath() {
    return this.name || this.path || (typeof this.tag === 'string' ? this.tag : '');
  }
}

class InitialRoute extends Route {

}

class ChildRequest {
  constructor(request, matcher) {
    this.request = request;
    this.matcher = matcher;
    this.uri = this.request.uri.substring(matcher.found.length);
    this.parentUri = this.request.uri.substring(0, matcher.found.length);
    this.query = this.request.query;
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
    return {
      route: this,
      tag: this.tag,
      api: this.api,
      found: request.uri
    };
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
      response.redirectTo = parent + uri;
      return true;
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
      return {
        route: this,
        tag: this.tag,
        api: this.api,
        found: uri
      };
  }
}

class Request {
  constructor(uri, query) {
    this.uri = uri;
    this.query = query;
  }
}

class Response {
  constructor(request) {
    this.uri = request.uri;
    this.matches = [];
    this.params = {};
    this.query = request.query;
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

function registerTag(router) {
  riot.tag('route', '<router-content></router-content>', '', '', function (opts) {
    this.calculateLevel = function (target) {
      var level = 0;
      if (target.parent) level += this.calculateLevel(target.parent);
      if (target.opts.__router_level) level += target.opts.__router_level;
      if (target.__router_tag) level += 1;
      return level;
    }.bind(this);

    this.normalizeTag = function (tag, api, options) {
      var result = tag(api, options);
      if (typeof result === 'string') {
        tag = result;
      } else {
        tag = result.tag || tag;
        api = result.api || api;
      }
      return [tag, api, options];
    }

    this.unmountTag = function () {
      if (this.instance)
        this.instance.unmount(true);
    }

    this.mountTag = function (tag, api, options) {
      if (typeof tag === 'function') {
        [tag, api, options] = this.normalizeTag(tag, api, options);
      }
      if (this.canUpdate(tag, api, options)) {
        this.instance.update(api);
      } else {
        this.unmountTag();
        if (tag) {
          this.root.replaceChild(document.createElement(tag), this.root.children[0]);
          try {
            this.instance = riot.mount(this.root.children[0], tag, api)[0];
          } catch (e) {
            error("Error when mounting tag '" + tag + "'.", e);
            return;
          }
          this.instanceTag = tag;
          this.instanceApi = api;
        }
      }
    }

    this.canUpdate = function (tag, api, options) {
      if ((!router.config.updatable && !opts.updatable && !options.updatable) ||
        !this.instance ||
        !this.instance.isMounted ||
        this.instanceTag !== tag)
        return false;
      return true;
    }

    this.updateRoute = function () {
      var mount = {
        tag: null
      };
      if (router && router.current) {
        var response = router.current;
        if (this.level <= response.size()) {
          var matcher = response.get(this.level);
          if (matcher) {
            var params = matcher.params || {};
            var query = response.query || {};
            var api = extend(true, {}, opts, query, matcher.api, params, {
              __router_level: this.level,
              query: query
            });
            mount = {
              tag: matcher.tag,
              api: api,
              updatable: matcher.route.updatable
            };
          }
        }
      }
      if (mount.tag)
        this.mountTag(mount.tag, mount.api, mount);
      else
        this.unmountTag();
    }.bind(this);

    this.__router_tag = 'route';
    this.level = this.calculateLevel(this);
    router.on('route:updated', this.updateRoute);
    this.on('unmount', function () {
      router.off('route:updated', this.updateRoute);
      this.unmountTag();
    }.bind(this));
    this.on('mount', this.updateRoute);
  });
}

function detectRoute() {
  var route = riot.route ||
    (window && window.route) ||
    (global && global.route);
  return route;
}

function create(config) {
  var router = new Router();
  router.configure(extend(true, {
    updatable: true,
    route: detectRoute(),
    base: '#',
    parser: function customRiotParser(path) {
      var raw = path.split('?'),
        uri = raw[0].split('/'),
        query = raw[1],
        params = {}
      if (query) {
        query.split('&').forEach(function (v) {
          var c = v.split('=')
          params[c[0]] = c[1]
        })
      }
      uri.push(params)
      return uri
    }
  }, config));
  registerTag(router);
  if (!Router.instance) Router.instance = router;
  return router;
}
Router.create = create;
Router.Route = Route;
Router.DefaultRoute = DefaultRoute;
Router.RedirectRoute = RedirectRoute;
Router.NotFoundRoute = NotFoundRoute;
Router._ = {
  Response: Response,
  Request: Request
};
module.exports = Router;
