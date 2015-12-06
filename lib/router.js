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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, require('riot'), require('extend'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, global.riot, global.extend);
	    global.router = mod.exports;
	  }
	})(this, function (module, riot, extend) {
	  var _slicedToArray = (function () {
	    function sliceIterator(arr, i) {
	      var _arr = [];
	      var _n = true;
	      var _d = false;
	      var _e = undefined;

	      try {
	        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	          _arr.push(_s.value);

	          if (i && _arr.length === i) break;
	        }
	      } catch (err) {
	        _d = true;
	        _e = err;
	      } finally {
	        try {
	          if (!_n && _i["return"]) _i["return"]();
	        } finally {
	          if (_d) throw _e;
	        }
	      }

	      return _arr;
	    }

	    return function (arr, i) {
	      if (Array.isArray(arr)) {
	        return arr;
	      } else if (Symbol.iterator in Object(arr)) {
	        return sliceIterator(arr, i);
	      } else {
	        throw new TypeError("Invalid attempt to destructure non-iterable instance");
	      }
	    };
	  })();

	  function _possibleConstructorReturn(self, call) {
	    if (!self) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }

	    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	  }

	  var _get = function get(object, property, receiver) {
	    if (object === null) object = Function.prototype;
	    var desc = Object.getOwnPropertyDescriptor(object, property);

	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);

	      if (parent === null) {
	        return undefined;
	      } else {
	        return get(parent, property, receiver);
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;

	      if (getter === undefined) {
	        return undefined;
	      }

	      return getter.call(receiver);
	    }
	  };

	  function _inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	    }

	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	  }

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  var _createClass = (function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  })();

	  var error = console && console.error || function () {};

	  var Router = (function () {
	    function Router() {
	      _classCallCheck(this, Router);

	      riot.router = this;
	      riot.observable(this);
	      this.interceptors = [this.processRoute.bind(this)];
	      this.handler = new InitialRoute();
	      this.current = new Context("").response;
	      this.process = this.process.bind(this);
	    }

	    _createClass(Router, [{
	      key: 'route',
	      value: function route(handler) {
	        this.handler = handler;
	      }
	    }, {
	      key: 'routes',
	      value: function routes(_routes) {
	        this.route(new InitialRoute().routes(_routes));
	      }
	    }, {
	      key: 'use',
	      value: function use(interceptor) {
	        this.interceptors.push(interceptor);
	      }
	    }, {
	      key: 'process',
	      value: function process() {
	        var params = Array.prototype.slice.call(arguments);
	        var uri = params.join("/");
	        if (uri[0] !== '/') uri = "/" + uri;
	        var context = new Context(uri);
	        if (!this.rootContext) this.rootContext = context;
	        this.processRequest(context);
	        return context;
	      }
	    }, {
	      key: 'processRequest',
	      value: function processRequest(context) {
	        this.processInterceptors(context);
	        return this.processResponse(context);
	      }
	    }, {
	      key: 'processResponse',
	      value: function processResponse(context) {
	        if (this.isRedirect(context)) {
	          return this.processRedirect(context);
	        }

	        var request = context.request;
	        var response = context.response;

	        if (!response.redirectTo) {
	          this.current = response;
	          this.rootContext = null;
	          this.trigger('route:updated', response);
	          return context;
	        }
	      }
	    }, {
	      key: 'isRedirect',
	      value: function isRedirect(context) {
	        return !!context.response.redirectTo;
	      }
	    }, {
	      key: 'processRedirect',
	      value: function processRedirect(context) {
	        var uri = context.response.redirectTo;
	        this.rootContext.addRedirect(uri);
	        this.navigateTo(uri);
	      }
	    }, {
	      key: 'navigateTo',
	      value: function navigateTo(uri) {
	        riot.route(uri);
	      }
	    }, {
	      key: 'processInterceptors',
	      value: function processInterceptors(context, preInterceptors, postInterceptors) {
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
	      }
	    }, {
	      key: 'processRoute',
	      value: function processRoute(request, response, next, context) {
	        this.handler.process(request, response, context);
	        return next();
	      }
	    }, {
	      key: 'start',
	      value: function start() {
	        riot.route(this.process);
	        riot.route.start();
	        this.exec();
	      }
	    }, {
	      key: 'exec',
	      value: function exec() {
	        riot.route.exec(this.process);
	      }
	    }]);

	    return Router;
	  })();

	  var Context = (function () {
	    function Context(request) {
	      _classCallCheck(this, Context);

	      this.request = typeof request === 'string' ? new Request(request) : request;
	      this.response = new Response(this.request);
	      this.redirectStack = [];
	    }

	    _createClass(Context, [{
	      key: 'addRedirect',
	      value: function addRedirect(uri) {
	        if (this.redirectStack.indexOf(uri) > -1) throw new Error("Cyclic redirection to " + uri + ". Stack = " + this.redirectStack);
	        this.redirectStack.push(uri);
	      }
	    }]);

	    return Context;
	  })();

	  var Handler = (function () {
	    function Handler() {
	      _classCallCheck(this, Handler);
	    }

	    _createClass(Handler, [{
	      key: 'matches',
	      value: function matches(request) {
	        return false;
	      }
	    }, {
	      key: 'process',
	      value: function process(request, response) {
	        var matcher = this.matches(request);
	        if (!matcher) return this.routeMiss(request, response);
	        return this.routeMatch(request, response, matcher);
	      }
	    }, {
	      key: 'routeMatch',
	      value: function routeMatch(request, response, matcher) {
	        response.add(matcher);
	        return true;
	      }
	    }, {
	      key: 'routeMiss',
	      value: function routeMiss(request, response) {
	        return false;
	      }
	    }, {
	      key: 'processRoutes',
	      value: function processRoutes(request, response, routes) {
	        if (routes && routes.length) {
	          var t = routes.length;

	          for (var i = 0; i < t; i++) {
	            var route = routes[i];
	            if (route.process(request, response)) return true;
	          }

	          return false;
	        }
	      }
	    }, {
	      key: 'createRequest',
	      value: function createRequest(request, matcher) {
	        return new ChildRequest(request, matcher);
	      }
	    }]);

	    return Handler;
	  })();

	  var Route = (function (_Handler) {
	    _inherits(Route, _Handler);

	    function Route(options) {
	      _classCallCheck(this, Route);

	      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Route).call(this, options));

	      options = options || {};
	      _this.tag = options.tag;
	      _this.api = options.api;
	      _this.path = options.path;
	      _this.name = options.name;
	      _this.updatable = options.updatable;
	      _this.pathParameterNames = [];

	      var path = _this.getPath().replace(/^\//, "");

	      _this.pattern = "^/?" + path.replace(/:([^/]+)/g, (function (ignored, group) {
	        this.pathParameterNames.push(group);
	        return "([^/]+)";
	      }).bind(_this)) + "(:?/|$)";
	      _this.regex = new RegExp(_this.pattern);
	      return _this;
	    }

	    _createClass(Route, [{
	      key: 'routes',
	      value: function routes(_routes2) {
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

	        if (notFoundRoutes.length > 1) error("Can't use more than one NotFoundRoute per route. --> " + this.getPath());
	        if (defaultRoutes.length > 1) error("Can't use more than one DefaultRoute per route. --> " + this.getPath());
	        this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
	        return this;
	      }
	    }, {
	      key: 'matches',
	      value: function matches(request) {
	        var matcher = this.regex.exec(request.uri);

	        if (matcher) {
	          var params = {};

	          for (var i in this.pathParameterNames) {
	            var name = this.pathParameterNames[i];
	            params[name] = decodeURIComponent(matcher[parseInt(i, 10) + 1]);
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
	    }, {
	      key: 'routeMatch',
	      value: function routeMatch(request, response, matcher) {
	        var matches = _get(Object.getPrototypeOf(Route.prototype), 'routeMatch', this).call(this, request, response, matcher);

	        this.processRoutes(request, response, matcher);
	        return matches;
	      }
	    }, {
	      key: 'processRoutes',
	      value: function processRoutes(request, response, matcher) {
	        return _get(Object.getPrototypeOf(Route.prototype), 'processRoutes', this).call(this, this.createRequest(request, matcher), response, this._routes);
	      }
	    }, {
	      key: 'getPath',
	      value: function getPath() {
	        return this.name || this.path || (typeof this.tag === 'string' ? this.tag : '');
	      }
	    }]);

	    return Route;
	  })(Handler);

	  var InitialRoute = (function (_Route) {
	    _inherits(InitialRoute, _Route);

	    function InitialRoute() {
	      _classCallCheck(this, InitialRoute);

	      return _possibleConstructorReturn(this, Object.getPrototypeOf(InitialRoute).apply(this, arguments));
	    }

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
	    _inherits(NotFoundRoute, _Handler2);

	    function NotFoundRoute(options) {
	      _classCallCheck(this, NotFoundRoute);

	      var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(NotFoundRoute).call(this, options));

	      options = options || {};
	      _this3.tag = options.tag;
	      _this3.api = options.api;
	      return _this3;
	    }

	    _createClass(NotFoundRoute, [{
	      key: 'matches',
	      value: function matches(request) {
	        return {
	          route: this,
	          tag: this.tag,
	          api: this.api,
	          found: request.uri
	        };
	      }
	    }]);

	    return NotFoundRoute;
	  })(Handler);

	  var RedirectRoute = (function (_Handler3) {
	    _inherits(RedirectRoute, _Handler3);

	    function RedirectRoute(options) {
	      _classCallCheck(this, RedirectRoute);

	      var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(RedirectRoute).call(this, options));

	      options = options || {};
	      _this4.from = options.from;
	      _this4.to = options.to;
	      _this4.pattern = "(^/?)" + _this4.from + "(/|$)";
	      _this4.regex = new RegExp(_this4.pattern);
	      return _this4;
	    }

	    _createClass(RedirectRoute, [{
	      key: 'process',
	      value: function process(request, response) {
	        var uri = request.uri.replace(this.regex, "$1" + this.to + "$2");

	        if (uri !== request.uri) {
	          var parent = request.parentUri || "";
	          response.redirectTo = parent + uri;
	          return true;
	        }
	      }
	    }]);

	    return RedirectRoute;
	  })(Handler);

	  var DefaultRoute = (function (_Handler4) {
	    _inherits(DefaultRoute, _Handler4);

	    function DefaultRoute(options) {
	      _classCallCheck(this, DefaultRoute);

	      var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(DefaultRoute).call(this, options));

	      options = options || {};
	      _this5.tag = options.tag;
	      _this5.api = options.api;
	      return _this5;
	    }

	    _createClass(DefaultRoute, [{
	      key: 'matches',
	      value: function matches(request) {
	        var uri = request.uri.trim();
	        if (uri === "/" || uri === "") return {
	          route: this,
	          tag: this.tag,
	          api: this.api,
	          found: uri
	        };
	      }
	    }]);

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

	    _createClass(Response, [{
	      key: 'add',
	      value: function add(matcher) {
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
	    }, {
	      key: 'get',
	      value: function get(index) {
	        return this.matches[index];
	      }
	    }, {
	      key: 'size',
	      value: function size() {
	        return this.matches.length;
	      }
	    }, {
	      key: 'isEmpty',
	      value: function isEmpty() {
	        return this.matches.length;
	      }
	    }]);

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

	    this.normalizeTag = function (tag, api, options) {
	      var result = tag(api, options);

	      if (typeof result === 'string') {
	        tag = result;
	      } else {
	        tag = result.tag || tag;
	        api = result.api || api;
	      }

	      return [tag, api, options];
	    };

	    this.unmountTag = function () {
	      if (this.instance) this.instance.unmount(true);
	    };

	    this.mountTag = function (tag, api, options) {
	      if (typeof tag === 'function') {
	        var _normalizeTag = this.normalizeTag(tag, api, options);

	        var _normalizeTag2 = _slicedToArray(_normalizeTag, 3);

	        tag = _normalizeTag2[0];
	        api = _normalizeTag2[1];
	        options = _normalizeTag2[2];
	      }

	      if (this.canUpdate(tag, api, options)) {
	        this.instance.update(api);
	      } else {
	        this.unmountTag();

	        if (tag) {
	          this.root.replaceChild(document.createElement(tag), this.root.children[0]);
	          this.instance = riot.mount(this.root.children[0], tag, api)[0];
	          this.instanceTag = tag;
	          this.instanceApi = api;
	        }
	      }
	    };

	    this.canUpdate = function (tag, api, options) {
	      if (!riot.router.config.updatable && !opts.updatable && !options.updatable || !this.instance || !this.instance.isMounted || this.instanceTag !== tag) return false;
	      return true;
	    };

	    this.updateRoute = (function () {
	      var mount = {
	        tag: null
	      };

	      if (riot.router && riot.router.current) {
	        var response = riot.router.current;

	        if (this.level <= response.size()) {
	          var matcher = response.get(this.level);

	          if (matcher) {
	            var params = matcher.params || {};
	            var api = extend(true, {}, matcher.api, params, {
	              __router_level: this.level
	            });
	            mount = {
	              tag: matcher.tag,
	              api: api,
	              updatable: matcher.route.updatable
	            };
	          }
	        }
	      }

	      if (mount.tag) this.mountTag(mount.tag, mount.api, mount);else this.unmountTag();
	    }).bind(this);

	    this.__router_tag = 'route';
	    this.level = this.calculateLevel(this);
	    riot.router.on('route:updated', this.updateRoute);
	    this.on('unmount', (function () {
	      riot.router.off('route:updated', this.updateRoute);
	      this.unmountTag();
	    }).bind(this));
	    this.on('mount', (function () {
	      this.updateRoute();
	    }).bind(this));
	  });
	  var router = new Router();
	  router.Route = Route;
	  router.DefaultRoute = DefaultRoute;
	  router.RedirectRoute = RedirectRoute;
	  router.NotFoundRoute = NotFoundRoute;
	  router._ = {
	    Response: Response,
	    Request: Request
	  };
	  router.config = {
	    updatable: false
	  };
	  riot.router = router;
	  module.exports = router;
	});

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