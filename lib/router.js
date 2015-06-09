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
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var riot = __webpack_require__(1);
	var error = console && console.error || function () {};
	
	var Router = (function () {
	  function Router() {
	    _classCallCheck(this, Router);
	
	    riot.router = this;
	    riot.observable(this);
	    this.handler = new Route();
	    this.current = new Response(new Request(''));
	    this.handleRequest = this.handleRequest.bind(this);
	  }
	
	  _createClass(Router, [{
	    key: 'route',
	    value: function route(handler) {
	      this.handler = handler;
	    }
	  }, {
	    key: 'process',
	    value: function process(request) {
	      var response = new Response(request);
	      this.handler.process(request, response);
	      this.current = response;
	      this.trigger('route:updated', response);
	      return response;
	    }
	  }, {
	    key: 'handleRequest',
	    value: function handleRequest() {
	      var params = Array.prototype.slice.call(arguments);
	      this.process(new Request(params.join('/')));
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      riot.route(this.handleRequest);
	      riot.route.start();
	      riot.route.exec(this.handleRequest);
	    }
	  }]);
	
	  return Router;
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
	      if (!matcher) return this.processNotMatch(request, response);
	      return this.processMatch(request, response, matcher);
	    }
	  }, {
	    key: 'processMatch',
	    value: function processMatch(request, response, matcher) {
	      response.add(matcher);
	      return true;
	    }
	  }, {
	    key: 'processNotMatch',
	    value: function processNotMatch(request, response) {
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
	  }]);
	
	  return Handler;
	})();
	
	var Route = (function (_Handler) {
	  function Route(options) {
	    _classCallCheck(this, Route);
	
	    _get(Object.getPrototypeOf(Route.prototype), 'constructor', this).call(this, options);
	    options = options || {};
	    this.tag = options.tag;
	    this.path = options.path;
	    this.name = options.name;
	    this.pathParameterNames = [];
	    this.pattern = '^/?' + (this.path || this.name || '').replace(/^\//, '').replace(/:([^/]+)/, (function (ignored, group) {
	      this.pathParameterNames.push(group);
	      return '([^/]+)';
	    }).bind(this)) + '(:?/|$)';
	    this.regex = new RegExp(this.pattern);
	  }
	
	  _inherits(Route, _Handler);
	
	  _createClass(Route, [{
	    key: 'routes',
	    value: function routes(_routes) {
	      var redirectRoutes = _routes.filter(function (r) {
	        return r instanceof RedirectRoute;
	      });
	      var defaultRoutes = _routes.filter(function (r) {
	        return r instanceof DefaultRoute;
	      });
	      var notFoundRoutes = _routes.filter(function (r) {
	        return r instanceof NotFoundRoute;
	      });
	      var otherRoutes = _routes.filter(function (r) {
	        return redirectRoutes.indexOf(r) === -1 && defaultRoutes.indexOf(r) === -1 && notFoundRoutes.indexOf(r) === -1;
	      });
	      if (notFoundRoutes.length > 1) error('Can\'t use more than one NotFoundRoute per route. --> ' + (this.name || this.path || this.tag));
	      if (defaultRoutes.length > 1) error('Can\'t use more than one DefaultRoute per route. --> ' + (this.name || this.path || this.tag));this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
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
	          params[name] = matcher[parseInt(i, 10) + 1];
	        }
	        return { route: this, tag: this.tag, found: matcher[0], params: params };
	      }
	      return false;
	    }
	  }, {
	    key: 'processMatch',
	    value: function processMatch(request, response, matcher) {
	      var matches = _get(Object.getPrototypeOf(Route.prototype), 'processMatch', this).call(this, request, response, matcher);
	      this.processRoutes(request, response, matcher);
	      return matches;
	    }
	  }, {
	    key: 'processRoutes',
	    value: function processRoutes(request, response, matcher) {
	      return _get(Object.getPrototypeOf(Route.prototype), 'processRoutes', this).call(this, new RouteChildRequest(request, matcher), response, this._routes);
	    }
	  }]);
	
	  return Route;
	})(Handler);
	
	var RouteChildRequest = function RouteChildRequest(request, matcher) {
	  _classCallCheck(this, RouteChildRequest);
	
	  this.request = request;
	  this.matcher = matcher;
	  this.uri = this.request.uri.substring(matcher.found.length);
	  this.parentUri = this.request.uri.substring(0, matcher.found.length);
	};
	
	var NotFoundRoute = (function (_Handler2) {
	  function NotFoundRoute(options) {
	    _classCallCheck(this, NotFoundRoute);
	
	    _get(Object.getPrototypeOf(NotFoundRoute.prototype), 'constructor', this).call(this, options);
	    options = options || {};
	    this.tag = options.tag;
	  }
	
	  _inherits(NotFoundRoute, _Handler2);
	
	  _createClass(NotFoundRoute, [{
	    key: 'matches',
	    value: function matches(request) {
	      return { route: this, tag: this.tag, found: request.uri };
	    }
	  }]);
	
	  return NotFoundRoute;
	})(Handler);
	
	var RedirectRoute = (function (_Handler3) {
	  function RedirectRoute(options) {
	    _classCallCheck(this, RedirectRoute);
	
	    _get(Object.getPrototypeOf(RedirectRoute.prototype), 'constructor', this).call(this, options);
	    options = options || {};
	    this.from = options.from;
	    this.to = options.to;
	    this.pattern = '(^/?)' + this.from + '(/|$)';
	    this.regex = new RegExp(this.pattern);
	  }
	
	  _inherits(RedirectRoute, _Handler3);
	
	  _createClass(RedirectRoute, [{
	    key: 'process',
	    value: function process(request, response) {
	      var uri = request.uri.replace(this.regex, '$1' + this.to + '$2');
	      if (uri !== request.uri) {
	        var matcher = this.regex.exec(request.uri);
	        var parent = request.parentUri || '';
	        response.uri = parent + uri;
	        request.uri = uri;
	      }
	    }
	  }]);
	
	  return RedirectRoute;
	})(Handler);
	
	var DefaultRoute = (function (_Handler4) {
	  function DefaultRoute(options) {
	    _classCallCheck(this, DefaultRoute);
	
	    _get(Object.getPrototypeOf(DefaultRoute.prototype), 'constructor', this).call(this, options);
	    options = options || {};
	    this.tag = options.tag;
	  }
	
	  _inherits(DefaultRoute, _Handler4);
	
	  _createClass(DefaultRoute, [{
	    key: 'matches',
	    value: function matches(request) {
	      var uri = request.uri.trim();
	      if (uri === '/' || uri === '') return { route: this, tag: this.tag, found: uri };
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
	
	riot.tag('route-empty', '', function (opts) {});
	
	riot.tag('route', '<route-content name="content"></route-content>', function (opts) {
	  this.calculateLevel = (function (target) {
	    var level = 0;
	    if (target.parent) level += this.calculateLevel(target.parent);
	    if (target.opts.__router_level) level += target.opts.__router_level;
	    if (target.__router_tag) level += 1;
	    return level;
	  }).bind(this);
	
	  this.mountTag = function (tag, api) {
	    if (this.instance) this.instance.forEach(function (instance) {
	      instance.unmount(true);
	    });
	    if (tag) this.instance = riot.mount(this.root.children[0], tag, api);
	  };
	
	  this.updateRoute = (function () {
	    var mount = { tag: 'route-empty' };
	    if (riot.router && riot.router.current) {
	      var response = riot.router.current;
	      if (this.level <= response.size()) {
	        var matcher = response.get(this.level);
	        if (matcher) {
	          var api = JSON.parse(JSON.stringify(matcher.params || {}));
	          api.__router_level = this.level;
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
	  }).bind(this));
	});
	
	var router = new Router();
	router.Route = Route;
	router.DefaultRoute = DefaultRoute;
	router.RedirectRoute = RedirectRoute;
	router.NotFoundRoute = NotFoundRoute;
	router._ = { Response: Response, Request: Request };
	
	riot.router = router;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=router.js.map