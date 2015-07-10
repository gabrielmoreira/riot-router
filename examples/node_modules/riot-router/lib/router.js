(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("riot"));
	else if(typeof define === 'function' && define.amd)
		define(["riot"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("riot")) : factory(root["riot"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var riot = __webpack_require__(1);
	var extend = __webpack_require__(2);
	var error = console && console.error || function () {};
	
	var Router = (function () {
	  function Router() {
	    _classCallCheck(this, Router);
	
	    riot.router = this;
	    riot.observable(this);
	    this.interceptors = [this.processRoute.bind(this)];
	    this.handler = new InitialRoute();
	    this.current = new Context('').response;
	    this.process = this.process.bind(this);
	  }
	
	  Router.prototype.route = function route(handler) {
	    this.handler = handler;
	  };
	
	  Router.prototype.routes = function routes(_routes) {
	    this.route(new Route().routes(_routes));
	  };
	
	  Router.prototype.use = function use(interceptor) {
	    this.interceptors.push(interceptor);
	  };
	
	  Router.prototype.process = function process() {
	    var params = Array.prototype.slice.call(arguments);
	    var context = new Context(params.join('/'));
	    this.processRequest(context);
	    return context;
	  };
	
	  Router.prototype.processRequest = function processRequest(context) {
	    this.processInterceptors(context);
	    return this.processResponse(context);
	  };
	
	  Router.prototype.processResponse = function processResponse(context) {
	    if (this.isRedirect(context)) {
	      return this.processRedirect(context);
	    }
	    var request = context.request;
	    var response = context.response;
	
	    if (!response.redirectTo) {
	      this.current = response;
	      this.trigger('route:updated', response);
	      return context;
	    }
	  };
	
	  Router.prototype.isRedirect = function isRedirect(context) {
	    return !!context.response.redirectTo;
	  };
	
	  Router.prototype.processRedirect = function processRedirect(context) {
	    context.redirectTo(context.response.redirectTo);
	    return this.processRequest(context);
	  };
	
	  Router.prototype.processInterceptors = function processInterceptors(context, preInterceptors, postInterceptors) {
	    var interceptors = (preInterceptors || []).concat(this.interceptors).concat(postInterceptors || []);
	    var next = function next() {
	      if (!context.stop) {
	        var processor = interceptors.shift();
	        var request = context.request;
	        var response = context.response;
	
	        if (processor) return processor(request, response, next, context);
	      }
	      return context;
	    };
	    return next();
	  };
	
	  Router.prototype.processRoute = function processRoute(request, response, next, context) {
	    this.handler.process(request, response, context);
	    return next();
	  };
	
	  Router.prototype.start = function start() {
	    riot.route(this.process);
	    riot.route.start();
	    this.exec();
	  };
	
	  Router.prototype.exec = function exec() {
	    riot.route.exec(this.process);
	  };
	
	  return Router;
	})();
	
	var Context = (function () {
	  function Context(request) {
	    _classCallCheck(this, Context);
	
	    this.request = typeof request === 'string' ? new Request(request) : request;
	    this.response = new Response(this.request);
	    this.redirectStack = [];
	  }
	
	  Context.prototype.redirectTo = function redirectTo(uri) {
	    if (this.redirectStack.indexOf(uri) > -1) throw new Error('Cyclic redirection to ' + uri + '. Stack = ' + this.redirectStack);
	    this.redirectStack.push(uri);
	    this.request = new Request(uri);
	    this.response = new Response(this.request);
	  };
	
	  return Context;
	})();
	
	var Handler = (function () {
	  function Handler() {
	    _classCallCheck(this, Handler);
	  }
	
	  Handler.prototype.matches = function matches(request) {
	    return false;
	  };
	
	  Handler.prototype.process = function process(request, response) {
	    var matcher = this.matches(request);
	    if (!matcher) return this.processNotMatch(request, response);
	    return this.processMatch(request, response, matcher);
	  };
	
	  Handler.prototype.processMatch = function processMatch(request, response, matcher) {
	    response.add(matcher);
	    return true;
	  };
	
	  Handler.prototype.processNotMatch = function processNotMatch(request, response) {
	    return false;
	  };
	
	  Handler.prototype.processRoutes = function processRoutes(request, response, routes) {
	    if (routes && routes.length) {
	      var t = routes.length;
	      for (var i = 0; i < t; i++) {
	        var route = routes[i];
	        if (route.process(request, response)) return true;
	      }
	      return false;
	    }
	  };
	
	  Handler.prototype.createRequest = function createRequest(request, matcher) {
	    return new ChildRequest(request, matcher);
	  };
	
	  return Handler;
	})();
	
	var Route = (function (_Handler) {
	  function Route(options) {
	    _classCallCheck(this, Route);
	
	    _Handler.call(this, options);
	    options = options || {};
	    this.tag = options.tag;
	    this.api = options.api;
	    this.path = options.path;
	    this.name = options.name;
	    this.pathParameterNames = [];
	    var path = (this.path || this.name || this.tag || '').replace(/^\//, '');
	    this.pattern = '^/?' + path.replace(/:([^/]+)/g, (function (ignored, group) {
	      this.pathParameterNames.push(group);
	      return '([^/]+)';
	    }).bind(this)) + '(:?/|$)';
	    this.regex = new RegExp(this.pattern);
	  }
	
	  _inherits(Route, _Handler);
	
	  Route.prototype.routes = function routes(_routes2) {
	    var redirectRoutes = _routes2.filter(function (r) {
	      return r instanceof RedirectRoute;
	    });
	    var defaultRoutes = _routes2.filter(function (r) {
	      return r instanceof DefaultRoute;
	    });
	    var notFoundRoutes = _routes2.filter(function (r) {
	      return r instanceof NotFoundRoute;
	    });
	    var otherRoutes = _routes2.filter(function (r) {
	      return redirectRoutes.indexOf(r) === -1 && defaultRoutes.indexOf(r) === -1 && notFoundRoutes.indexOf(r) === -1;
	    });
	    if (notFoundRoutes.length > 1) error('Can\'t use more than one NotFoundRoute per route. --> ' + (this.name || this.path || this.tag));
	    if (defaultRoutes.length > 1) error('Can\'t use more than one DefaultRoute per route. --> ' + (this.name || this.path || this.tag));
	    this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
	    return this;
	  };
	
	  Route.prototype.matches = function matches(request) {
	    var matcher = this.regex.exec(request.uri);
	    if (matcher) {
	      var params = {};
	      for (var i in this.pathParameterNames) {
	        var name = this.pathParameterNames[i];
	        params[name] = matcher[parseInt(i, 10) + 1];
	      }
	      return { route: this, tag: this.tag, api: this.api, found: matcher[0], params: params };
	    }
	    return false;
	  };
	
	  Route.prototype.processMatch = function processMatch(request, response, matcher) {
	    var matches = _Handler.prototype.processMatch.call(this, request, response, matcher);
	    this.processRoutes(request, response, matcher);
	    return matches;
	  };
	
	  Route.prototype.processRoutes = function processRoutes(request, response, matcher) {
	    return _Handler.prototype.processRoutes.call(this, _Handler.prototype.createRequest.call(this, request, matcher), response, this._routes);
	  };
	
	  return Route;
	})(Handler);
	
	var InitialRoute = (function (_Route) {
	  function InitialRoute() {
	    _classCallCheck(this, InitialRoute);
	
	    _Route.apply(this, arguments);
	  }
	
	  _inherits(InitialRoute, _Route);
	
	  InitialRoute.prototype.processMatch = function processMatch() {
	    return true;
	  };
	
	  InitialRoute.prototype.processRoutes = function processRoutes(request, response, matcher) {
	    return _Route.prototype.processRoutes.call(this, request, response, this._routes);
	  };
	
	  return InitialRoute;
	})(Route);
	
	var ChildRequest = function ChildRequest(request, matcher) {
	  _classCallCheck(this, ChildRequest);
	
	  this.request = request;
	  this.matcher = matcher;
	  this.uri = this.request.uri.substring(matcher.found.length);
	  this.parentUri = this.request.uri.substring(0, matcher.found.length);
	};
	
	var NotFoundRoute = (function (_Handler2) {
	  function NotFoundRoute(options) {
	    _classCallCheck(this, NotFoundRoute);
	
	    _Handler2.call(this, options);
	    options = options || {};
	    this.tag = options.tag;
	    this.api = options.api;
	  }
	
	  _inherits(NotFoundRoute, _Handler2);
	
	  NotFoundRoute.prototype.matches = function matches(request) {
	    return { route: this, tag: this.tag, api: this.api, found: request.uri };
	  };
	
	  return NotFoundRoute;
	})(Handler);
	
	var RedirectRoute = (function (_Handler3) {
	  function RedirectRoute(options) {
	    _classCallCheck(this, RedirectRoute);
	
	    _Handler3.call(this, options);
	    options = options || {};
	    this.from = options.from;
	    this.to = options.to;
	    this.pattern = '(^/?)' + this.from + '(/|$)';
	    this.regex = new RegExp(this.pattern);
	  }
	
	  _inherits(RedirectRoute, _Handler3);
	
	  RedirectRoute.prototype.process = function process(request, response) {
	    var uri = request.uri.replace(this.regex, '$1' + this.to + '$2');
	    if (uri !== request.uri) {
	      var parent = request.parentUri || '';
	      // Rewrite response.uri & request.uri
	      response.uri = parent + uri;
	      request.uri = uri;
	    }
	  };
	
	  return RedirectRoute;
	})(Handler);
	
	var DefaultRoute = (function (_Handler4) {
	  function DefaultRoute(options) {
	    _classCallCheck(this, DefaultRoute);
	
	    _Handler4.call(this, options);
	    options = options || {};
	    this.tag = options.tag;
	    this.api = options.api;
	  }
	
	  _inherits(DefaultRoute, _Handler4);
	
	  DefaultRoute.prototype.matches = function matches(request) {
	    var uri = request.uri.trim();
	    if (uri === '/' || uri === '') return { route: this, tag: this.tag, api: this.api, found: uri };
	  };
	
	  return DefaultRoute;
	})(Handler);
	
	var Request = function Request(uri) {
	  _classCallCheck(this, Request);
	
	  this.uri = uri;
	};
	
	var Response = (function () {
	  function Response(request) {
	    _classCallCheck(this, Response);
	
	    this.uri = request.uri;
	    this.matches = [];
	    this.params = {};
	  }
	
	  Response.prototype.add = function add(matcher) {
	    this.matches.push(matcher);
	    var params = matcher.params;
	    if (params) {
	      for (var key in params) {
	        if (params.hasOwnProperty(key)) {
	          this.params[key] = params[key];
	        }
	      }
	    }
	  };
	
	  Response.prototype.get = function get(index) {
	    return this.matches[index];
	  };
	
	  Response.prototype.size = function size() {
	    return this.matches.length;
	  };
	
	  Response.prototype.isEmpty = function isEmpty() {
	    return this.matches.length;
	  };
	
	  return Response;
	})();
	
	riot.tag('route', '<router-content></router-content>', function (opts) {
	  this.calculateLevel = (function (target) {
	    var level = 0;
	    if (target.parent) level += this.calculateLevel(target.parent);
	    if (target.opts.__router_level) level += target.opts.__router_level;
	    if (target.__router_tag) level += 1;
	    return level;
	  }).bind(this);
	
	  this.unmountTag = function () {
	    if (this.instance) this.instance.forEach(function (instance) {
	      instance.unmount(true);
	    });
	  };
	
	  this.mountTag = function (tag, api) {
	    this.unmountTag();
	    if (tag) {
	      this.root.replaceChild(document.createElement(tag), this.root.children[0]);
	      this.instance = riot.mount(this.root.children[0], tag, api);
	    }
	  };
	
	  this.updateRoute = (function () {
	    var mount = { tag: null };
	    if (riot.router && riot.router.current) {
	      var response = riot.router.current;
	      if (this.level <= response.size()) {
	        var matcher = response.get(this.level);
	        if (matcher) {
	          var params = matcher.params || {};
	          var api = extend(true, {}, matcher.api, params, { __router_level: this.level });
	          mount = { tag: matcher.tag, api: api };
	        }
	      }
	    }
	    this.mountTag(mount.tag, mount.api);
	  }).bind(this);
	
	  this.__router_tag = 'route';
	  this.level = this.calculateLevel(this);
	  riot.router.on('route:updated', this.updateRoute);
	
	  this.on('unmount', (function () {
	    riot.router.off('route:updated', this.updateRoute);
	    this.unmountTag();
	  }).bind(this));
	});
	
	var router = new Router();
	router.Route = Route;
	router.DefaultRoute = DefaultRoute;
	router.RedirectRoute = RedirectRoute;
	router.NotFoundRoute = NotFoundRoute;
	router._ = { Response: Response, Request: Request };
	
	riot.router = router;
	
	module.exports = router;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	
	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}
	
		return toStr.call(arr) === '[object Array]';
	};
	
	var isPlainObject = function isPlainObject(obj) {
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}
	
		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
			return false;
		}
	
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {/**/}
	
		return typeof key === 'undefined' || hasOwn.call(obj, key);
	};
	
	module.exports = function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}
	
		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];
	
					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}
	
							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);
	
						// Don't bring in undefined values
						} else if (typeof copy !== 'undefined') {
							target[name] = copy;
						}
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	


/***/ }
/******/ ])
});
;
//# sourceMappingURL=router.js.map