(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("riot"));
	else if(typeof define === 'function' && define.amd)
		define(["riot"], factory);
	else if(typeof exports === 'object')
		exports["Router"] = factory(require("riot"));
	else
		root["Router"] = factory(root["riot"]);
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(1), __webpack_require__(2), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(module, require('riot'), require('riot-route'), require('./src/router.js'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod, global.riot, global.riotRoute, global.router);
	        global.router = mod.exports;
	    }
	})(this, function (module, riot, route, Router) {
	    'use strict';
	
	    var router = Router.create({ route: route });
	    if (window) {
	        window.router = router;
	    }
	    module.exports = Router;
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
	
	var observable = _interopDefault(__webpack_require__(3));
	
	/**
	 * Simple client-side router
	 * @module riot-route
	 */
	
	var RE_ORIGIN = /^.+?\/\/+[^\/]+/;
	var EVENT_LISTENER = 'EventListener';
	var REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER;
	var ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER;
	var HAS_ATTRIBUTE = 'hasAttribute';
	var POPSTATE = 'popstate';
	var HASHCHANGE = 'hashchange';
	var TRIGGER = 'trigger';
	var MAX_EMIT_STACK_LEVEL = 3;
	var win = typeof window != 'undefined' && window;
	var doc = typeof document != 'undefined' && document;
	var hist = win && history;
	var loc = win && (hist.location || win.location);
	var prot = Router.prototype;
	var clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click';
	var central = observable();
	
	var started = false;
	var routeFound = false;
	var debouncedEmit;
	var base;
	var current;
	var parser;
	var secondParser;
	var emitStack = [];
	var emitStackLevel = 0;
	
	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}
	
	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var f = filter
	    .replace(/\?/g, '\\?')
	    .replace(/\*/g, '([^/?#]+?)')
	    .replace(/\.\./, '.*');
	  var re = new RegExp(("^" + f + "$"));
	  var args = path.match(re);
	
	  if (args) { return args.slice(1) }
	}
	
	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t;
	  return function () {
	    clearTimeout(t);
	    t = setTimeout(fn, delay);
	  }
	}
	
	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1);
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit);
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
	  doc[ADD_EVENT_LISTENER](clickEvent, click);
	  if (autoExec) { emit(true); }
	}
	
	/**
	 * Router class
	 */
	function Router() {
	  this.$ = [];
	  observable(this); // make it observable
	  central.on('stop', this.s.bind(this));
	  central.on('emit', this.e.bind(this));
	}
	
	function normalize(path) {
	  return path.replace(/^\/|\/$/, '')
	}
	
	function isString(str) {
	  return typeof str == 'string'
	}
	
	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href).replace(RE_ORIGIN, '')
	}
	
	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] === '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '').replace(base, '')
	}
	
	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel === 0;
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) { return }
	
	  emitStackLevel++;
	  emitStack.push(function() {
	    var path = getPathFromBase();
	    if (force || path !== current) {
	      central[TRIGGER]('emit', path);
	      current = path;
	    }
	  });
	  if (isRoot) {
	    var first;
	    while (first = emitStack.shift()) { first(); } // stack increses within this call
	    emitStackLevel = 0;
	  }
	}
	
	function click(e) {
	  if (
	    e.which !== 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) { return }
	
	  var el = e.target;
	  while (el && el.nodeName !== 'A') { el = el.parentNode; }
	
	  if (
	    !el || el.nodeName !== 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target !== '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) === -1 // cross origin
	  ) { return }
	
	  if (el.href !== loc.href
	    && (
	      el.href.split('#')[0] === loc.href.split('#')[0] // internal jump
	      || base[0] !== '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || base[0] === '#' && el.href.split(base)[0] !== loc.href.split(base)[0] // outside of #base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    )) { return }
	
	  e.preventDefault();
	}
	
	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  // Server-side usage: directly execute handlers for the path
	  if (!hist) { return central[TRIGGER]('emit', getPathFromBase(path)) }
	
	  path = base + normalize(path);
	  title = title || doc.title;
	  // browsers ignores the second parameter `title`
	  shouldReplace
	    ? hist.replaceState(null, title, path)
	    : hist.pushState(null, title, path);
	  // so we need to set it manually
	  doc.title = title;
	  routeFound = false;
	  emit();
	  return routeFound
	}
	
	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) { go(first, second, third || false); }
	  else if (second) { this.r(first, second); }
	  else { this.r('@', first); }
	};
	
	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*');
	  this.$ = [];
	};
	
	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter === '@' ? parser : secondParser)(normalize(path), normalize(filter));
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args));
	      return routeFound = true // exit from loop
	    }
	  }, this);
	};
	
	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter !== '@') {
	    filter = '/' + normalize(filter);
	    this.$.push(filter);
	  }
	  this.on(filter, action);
	};
	
	var mainRouter = new Router();
	var route = mainRouter.m.bind(mainRouter);
	
	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router();
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter);
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter);
	  return router
	};
	
	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#';
	  current = getPathFromBase(); // recalculate current path
	};
	
	/** Exec routing right now **/
	route.exec = function() {
	  emit(true);
	};
	
	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER;
	    secondParser = DEFAULT_SECOND_PARSER;
	  }
	  if (fn) { parser = fn; }
	  if (fn2) { secondParser = fn2; }
	};
	
	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {};
	  var href = loc.href || current;
	  href.replace(/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v; });
	  return q
	};
	
	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit);
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click);
	    }
	    central[TRIGGER]('stop');
	    started = false;
	  }
	};
	
	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState === 'complete') { start(autoExec); }
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else { win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec); }, 1);
	      }); }
	    }
	    started = true;
	  }
	};
	
	/** Prepare the router **/
	route.base();
	route.parser();
	
	module.exports = route;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	;(function(window, undefined) {var observable = function(el) {
	
	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */
	
	  el = el || {}
	
	  /**
	   * Private variables
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice
	
	  /**
	   * Public Api
	   */
	
	  // extend the el object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given `event` ands
	     * execute the `callback` each time an event is triggered.
	     * @param  { String } event - event id
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(event, fn) {
	        if (typeof fn == 'function')
	          (callbacks[event] = callbacks[event] || []).push(fn)
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Removes the given `event` listeners
	     * @param   { String } event - event id
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(event, fn) {
	        if (event == '*' && !fn) callbacks = {}
	        else {
	          if (fn) {
	            var arr = callbacks[event]
	            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	              if (cb == fn) arr.splice(i--, 1)
	            }
	          } else delete callbacks[event]
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Listen to the given `event` and
	     * execute the `callback` at most once
	     * @param   { String } event - event id
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(event, fn) {
	        function on() {
	          el.off(event, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(event, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Execute all callback functions that listen to
	     * the given `event`
	     * @param   { String } event - event id
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(event) {
	
	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns,
	          fn,
	          i
	
	        for (i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }
	
	        fns = slice.call(callbacks[event] || [], 0)
	
	        for (i = 0; fn = fns[i]; ++i) {
	          fn.apply(el, args)
	        }
	
	        if (callbacks['*'] && event != '*')
	          el.trigger.apply(el, ['*', event].concat(args))
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })
	
	  return el
	
	}
	  /* istanbul ignore next */
	  // support CommonJS, AMD & browser
	  if (true)
	    module.exports = observable
	  else if (typeof define === 'function' && define.amd)
	    define(function() { return observable })
	  else
	    window.observable = observable
	
	})(typeof window != 'undefined' ? window : undefined);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(1), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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
	  'use strict';
	
	  var _slicedToArray = function () {
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
	  }();
	
	  function _possibleConstructorReturn(self, call) {
	    if (!self) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }
	
	    return call && (typeof call === "object" || typeof call === "function") ? call : self;
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
	      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
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
	
	  var _createClass = function () {
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
	  }();
	
	  var error = console && console.error || function () {};
	
	  var Router = function () {
	    function Router() {
	      _classCallCheck(this, Router);
	
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
	        var query = {};
	        var uri = params.filter(function (p) {
	          if (typeof p !== 'string') {
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
	        var request = context.request,
	            response = context.response;
	
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
	        this.config.route(uri);
	      }
	    }, {
	      key: 'processInterceptors',
	      value: function processInterceptors(context, preInterceptors, postInterceptors) {
	        var interceptors = (preInterceptors || []).concat(this.interceptors).concat(postInterceptors || []);
	        var next = function next() {
	          if (!context.stop) {
	            var processor = interceptors.shift();
	            var request = context.request,
	                response = context.response;
	
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
	        this.config.route.start();
	        this.exec();
	      }
	    }, {
	      key: 'exec',
	      value: function exec() {
	        this.config.route.exec(this.process);
	      }
	    }, {
	      key: 'configure',
	      value: function configure(options) {
	        this.config = extend(true, {}, this.config, options);
	        if (this.config.route.parser && this.config.parser) this.config.route.parser(this.config.parser);
	        if (this.config.route.base && this.config.base) this.config.route.base(this.config.base);
	        this.config.route(this.process);
	      }
	    }]);
	
	    return Router;
	  }();
	
	  var Context = function () {
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
	  }();
	
	  var Handler = function () {
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
	  }();
	
	  var Route = function (_Handler) {
	    _inherits(Route, _Handler);
	
	    function Route(options) {
	      _classCallCheck(this, Route);
	
	      var _this = _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this, options));
	
	      options = options || {};
	      _this.tag = options.tag;
	      _this.api = options.api;
	      _this.path = options.path;
	      _this.name = options.name;
	      _this.updatable = options.updatable;
	      _this.pathParameterNames = [];
	      var path = _this.getPath().replace(/^\//, "");
	      _this.pattern = "^/?" + path.replace(/:([^/]+)/g, function (ignored, group) {
	        this.pathParameterNames.push(group);
	        return "([^/]+)";
	      }.bind(_this)) + "(:?/|$)";
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
	    }, {
	      key: 'routeMatch',
	      value: function routeMatch(request, response, matcher) {
	        var matches = _get(Route.prototype.__proto__ || Object.getPrototypeOf(Route.prototype), 'routeMatch', this).call(this, request, response, matcher);
	        this.processRoutes(request, response, matcher);
	        return matches;
	      }
	    }, {
	      key: 'processRoutes',
	      value: function processRoutes(request, response, matcher) {
	        return _get(Route.prototype.__proto__ || Object.getPrototypeOf(Route.prototype), 'processRoutes', this).call(this, this.createRequest(request, matcher), response, this._routes);
	      }
	    }, {
	      key: 'getPath',
	      value: function getPath() {
	        return this.name || this.path || (typeof this.tag === 'string' ? this.tag : '');
	      }
	    }]);
	
	    return Route;
	  }(Handler);
	
	  var InitialRoute = function (_Route) {
	    _inherits(InitialRoute, _Route);
	
	    function InitialRoute() {
	      _classCallCheck(this, InitialRoute);
	
	      return _possibleConstructorReturn(this, (InitialRoute.__proto__ || Object.getPrototypeOf(InitialRoute)).apply(this, arguments));
	    }
	
	    return InitialRoute;
	  }(Route);
	
	  var ChildRequest = function ChildRequest(request, matcher) {
	    _classCallCheck(this, ChildRequest);
	
	    this.request = request;
	    this.matcher = matcher;
	    this.uri = this.request.uri.substring(matcher.found.length);
	    this.parentUri = this.request.uri.substring(0, matcher.found.length);
	    this.query = this.request.query;
	  };
	
	  var NotFoundRoute = function (_Handler2) {
	    _inherits(NotFoundRoute, _Handler2);
	
	    function NotFoundRoute(options) {
	      _classCallCheck(this, NotFoundRoute);
	
	      var _this3 = _possibleConstructorReturn(this, (NotFoundRoute.__proto__ || Object.getPrototypeOf(NotFoundRoute)).call(this, options));
	
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
	  }(Handler);
	
	  var RedirectRoute = function (_Handler3) {
	    _inherits(RedirectRoute, _Handler3);
	
	    function RedirectRoute(options) {
	      _classCallCheck(this, RedirectRoute);
	
	      var _this4 = _possibleConstructorReturn(this, (RedirectRoute.__proto__ || Object.getPrototypeOf(RedirectRoute)).call(this, options));
	
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
	  }(Handler);
	
	  var DefaultRoute = function (_Handler4) {
	    _inherits(DefaultRoute, _Handler4);
	
	    function DefaultRoute(options) {
	      _classCallCheck(this, DefaultRoute);
	
	      var _this5 = _possibleConstructorReturn(this, (DefaultRoute.__proto__ || Object.getPrototypeOf(DefaultRoute)).call(this, options));
	
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
	  }(Handler);
	
	  var Request = function Request(uri, query) {
	    _classCallCheck(this, Request);
	
	    this.uri = uri;
	    this.query = query;
	  };
	
	  var Response = function () {
	    function Response(request) {
	      _classCallCheck(this, Response);
	
	      this.uri = request.uri;
	      this.matches = [];
	      this.params = {};
	      this.query = request.query;
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
	  }();
	
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
	      };
	
	      this.canUpdate = function (tag, api, options) {
	        if (!router.config.updatable && !opts.updatable && !options.updatable || !this.instance || !this.instance.isMounted || this.instanceTag !== tag) return false;
	        return true;
	      };
	
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
	        if (mount.tag) this.mountTag(mount.tag, mount.api, mount);else this.unmountTag();
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
	    var route = riot.route || window && window.route || global && global.route;
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
	            params = {};
	        if (query) {
	          query.split('&').forEach(function (v) {
	            var c = v.split('=');
	            params[c[0]] = c[1];
	          });
	        }
	        uri.push(params);
	        return uri;
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
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
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