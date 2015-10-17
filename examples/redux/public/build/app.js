(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
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
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _riot = __webpack_require__(1);
	
	var _riot2 = _interopRequireDefault(_riot);
	
	__webpack_require__(2);
	
	__webpack_require__(37);
	
	var _stores = __webpack_require__(4);
	
	var store = _interopRequireWildcard(_stores);
	
	var _riotRouterLibRouterJs = __webpack_require__(42);
	
	_riot2['default'].router.routes([new _riotRouterLibRouterJs.DefaultRoute({ tag: 'hello' })]);
	
	// Mount all Riot tags.
	_riot2['default'].mount('*');
	
	// Start routing
	_riot2['default'].router.start();
	
	window.store = store;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.2.4, @license MIT, (c) 2015 Muut Inc. + contributors */
	
	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.2.4', settings: {} },
	  //// be aware, internal usage
	
	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	
	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:opt(ion|group)|tbody|col|t[rhd])$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],
	
	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,
	
	  // Array.isArray for IE8 is in the polyfills
	  isArray = Array.isArray
	
	riot.observable = function(el) {
	
	  el = el || {}
	
	  var callbacks = {},
	      _id = 0
	
	  el.on = function(events, fn) {
	    if (isFunction(fn)) {
	      if (typeof fn.id === T_UNDEF) fn._id = _id++
	
	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn)
	        fn.typed = pos > 0
	      })
	    }
	    return el
	  }
	
	  el.off = function(events, fn) {
	    if (events == '*') callbacks = {}
	    else {
	      events.replace(/\S+/g, function(name) {
	        if (fn) {
	          var arr = callbacks[name]
	          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	            if (cb._id == fn._id) arr.splice(i--, 1)
	          }
	        } else {
	          callbacks[name] = []
	        }
	      })
	    }
	    return el
	  }
	
	  // only single event supported
	  el.one = function(name, fn) {
	    function on() {
	      el.off(name, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(name, on)
	  }
	
	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1),
	        fns = callbacks[name] || []
	
	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1
	        fn.apply(el, fn.typed ? [name].concat(args) : args)
	        if (fns[i] !== fn) { i-- }
	        fn.busy = 0
	      }
	    }
	
	    if (callbacks.all && name != 'all') {
	      el.trigger.apply(el, ['all', name].concat(args))
	    }
	
	    return el
	  }
	
	  return el
	
	}
	riot.mixin = (function() {
	  var mixins = {}
	
	  return function(name, mixin) {
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }
	
	})()
	
	;(function(riot, evt, win) {
	
	  // browsers only
	  if (!win) return
	
	  var loc = win.location,
	      fns = riot.observable(),
	      started = false,
	      current
	
	  function hash() {
	    return loc.href.split('#')[1] || ''   // why not loc.hash.splice(1) ?
	  }
	
	  function parser(path) {
	    return path.split('/')
	  }
	
	  function emit(path) {
	    if (path.type) path = hash()
	
	    if (path != current) {
	      fns.trigger.apply(null, ['H'].concat(parser(path)))
	      current = path
	    }
	  }
	
	  var r = riot.route = function(arg) {
	    // string
	    if (arg[0]) {
	      loc.hash = arg
	      emit(arg)
	
	    // function
	    } else {
	      fns.on('H', arg)
	    }
	  }
	
	  r.exec = function(fn) {
	    fn.apply(null, parser(hash()))
	  }
	
	  r.parser = function(fn) {
	    parser = fn
	  }
	
	  r.stop = function () {
	    if (started) {
	      if (win.removeEventListener) win.removeEventListener(evt, emit, false) //@IE8 - the if()
	      else win.detachEvent('on' + evt, emit) //@IE8
	      fns.off('*')
	      started = false
	    }
	  }
	
	  r.start = function () {
	    if (!started) {
	      if (win.addEventListener) win.addEventListener(evt, emit, false) //@IE8 - the if()
	      else win.attachEvent('on' + evt, emit) //IE8
	      started = true
	    }
	  }
	
	  // autostart the router
	  r.start()
	
	})(riot, 'hashchange', window)
	/*
	
	//// How it works?
	
	
	Three ways:
	
	1. Expressions: tmpl('{ value }', data).
	   Returns the result of evaluated expression as a raw object.
	
	2. Templates: tmpl('Hi { name } { surname }', data).
	   Returns a string with evaluated expressions.
	
	3. Filters: tmpl('{ show: !done, highlight: active }', data).
	   Returns a space separated list of trueish keys (mainly
	   used for setting html classes), e.g. "show highlight".
	
	
	// Template examples
	
	tmpl('{ title || "Untitled" }', data)
	tmpl('Results are { results ? "ready" : "loading" }', data)
	tmpl('Today is { new Date() }', data)
	tmpl('{ message.length > 140 && "Message is too long" }', data)
	tmpl('This item got { Math.round(rating) } stars', data)
	tmpl('<h1>{ title }</h1>{ body }', data)
	
	
	// Falsy expressions in templates
	
	In templates (as opposed to single expressions) all falsy values
	except zero (undefined/null/false) will default to empty string:
	
	tmpl('{ undefined } - { false } - { null } - { 0 }', {})
	// will return: " - - - 0"
	
	*/
	
	
	var brackets = (function(orig) {
	
	  var cachedBrackets,
	      r,
	      b,
	      re = /[{}]/g
	
	  return function(x) {
	
	    // make sure we use the current setting
	    var s = riot.settings.brackets || orig
	
	    // recreate cached vars if needed
	    if (cachedBrackets !== s) {
	      cachedBrackets = s
	      b = s.split(' ')
	      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
	    }
	
	    // if regexp given, rewrite it with current brackets (only if differ from default)
	    return x instanceof RegExp ? (
	        s === orig ? x :
	        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
	      ) :
	      // else, get specific bracket
	      b[x]
	  }
	})('{ }')
	
	
	var tmpl = (function() {
	
	  var cache = {},
	      OGLOB = '"in d?d:' + (window ? 'window).' : 'global).'),
	      reVars =
	      /(['"\/])(?:[^\\]*?|\\.|.)*?\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function\s*\()|([A-Za-z_$]\w*)/g
	
	  // build a template (or get it from cache), render with data
	  return function(str, data) {
	    return str && (cache[str] || (cache[str] = tmpl(str)))(data)
	  }
	
	
	  // create a template instance
	
	  function tmpl(s, p) {
	
	    if (s.indexOf(brackets(0)) < 0) {
	      // return raw text
	      s = s.replace(/\n|\r\n?/g, '\n')
	      return function () { return s }
	    }
	
	    // temporarily convert \{ and \} to a non-character
	    s = s
	      .replace(brackets(/\\{/g), '\uFFF0')
	      .replace(brackets(/\\}/g), '\uFFF1')
	
	    // split string to expression and non-expresion parts
	    p = split(s, extract(s, brackets(/{/), brackets(/}/)))
	
	    // is it a single expression or a template? i.e. {x} or <b>{x}</b>
	    s = (p.length === 2 && !p[0]) ?
	
	      // if expression, evaluate it
	      expr(p[1]) :
	
	      // if template, evaluate all expressions in it
	      '[' + p.map(function(s, i) {
	
	        // is it an expression or a string (every second part is an expression)
	        return i % 2 ?
	
	          // evaluate the expressions
	          expr(s, true) :
	
	          // process string parts of the template:
	          '"' + s
	
	            // preserve new lines
	            .replace(/\n|\r\n?/g, '\\n')
	
	            // escape quotes
	            .replace(/"/g, '\\"') +
	
	          '"'
	
	      }).join(',') + '].join("")'
	
	    return new Function('d', 'return ' + s
	      // bring escaped { and } back
	      .replace(/\uFFF0/g, brackets(0))
	      .replace(/\uFFF1/g, brackets(1)) + ';')
	
	  }
	
	
	  // parse { ... } expression
	
	  function expr(s, n) {
	    s = s
	
	      // convert new lines to spaces
	      .replace(/\n|\r\n?/g, ' ')
	
	      // trim whitespace, brackets, strip comments
	      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')
	
	    // is it an object literal? i.e. { key : value }
	    return /^\s*[\w- "']+ *:/.test(s) ?
	
	      // if object literal, return trueish keys
	      // e.g.: { show: isOpen(), done: item.done } -> "show done"
	      '[' +
	
	          // extract key:val pairs, ignoring any nested objects
	          extract(s,
	
	              // name part: name:, "name":, 'name':, name :
	              /["' ]*[\w- ]+["' ]*:/,
	
	              // expression part: everything upto a comma followed by a name (see above) or end of line
	              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
	              ).map(function(pair) {
	
	                // get key, val parts
	                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {
	
	                  // wrap all conditional parts to ignore errors
	                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'
	
	                })
	
	              }).join('') +
	
	        '].join(" ").trim()' :
	
	      // if js expression, evaluate as javascript
	      wrap(s, n)
	
	  }
	
	
	  // execute js w/o breaking on errors or undefined vars
	
	  function wrap(s, nonull) {
	    s = s.trim()
	    return !s ? '' : '(function(v){try{v=' +
	
	      // prefix vars (name => data.name)
	      s.replace(reVars, function(s, _, v) { return v ? '(("' + v + OGLOB + v + ')' : s }) +
	
	      // default to empty string for falsy values except zero
	      '}catch(e){}return ' + (nonull === true ? '!v&&v!==0?"":v' : 'v') + '}).call(d)'
	  }
	
	
	  // split string by an array of substrings
	
	  function split(str, substrings) {
	    var parts = []
	    substrings.map(function(sub, i) {
	
	      // push matched expression and part before it
	      i = str.indexOf(sub)
	      parts.push(str.slice(0, i), sub)
	      str = str.slice(i + sub.length)
	    })
	    if (str) parts.push(str)
	
	    // push the remaining part
	    return parts
	  }
	
	
	  // match strings between opening and closing regexp, skipping any inner/nested matches
	
	  function extract(str, open, close) {
	
	    var start,
	        level = 0,
	        matches = [],
	        re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g')
	
	    str.replace(re, function(_, open, close, pos) {
	
	      // if outer inner bracket, mark position
	      if (!level && open) start = pos
	
	      // in(de)crease bracket level
	      level += open ? 1 : -1
	
	      // if outer closing bracket, grab the match
	      if (!level && close != null) matches.push(str.slice(start, pos + close.length))
	
	    })
	
	    return matches
	  }
	
	})()
	
	/*
	  lib/browser/tag/mkdom.js
	
	  Includes hacks needed for the Internet Explorer version 9 and bellow
	
	*/
	// http://kangax.github.io/compat-table/es5/#ie8
	// http://codeplanet.io/dropping-ie8/
	
	var mkdom = (function (checkIE) {
	
	  var rootEls = {
	        'tr': 'tbody',
	        'th': 'tr',
	        'td': 'tr',
	        'tbody': 'table',
	        'col': 'colgroup'
	      },
	      GENERIC = 'div'
	
	  checkIE = checkIE && checkIE < 10
	
	  // creates any dom element in a div, table, or colgroup container
	  function _mkdom(html) {
	
	    var match = html && html.match(/^\s*<([-\w]+)/),
	        tagName = match && match[1].toLowerCase(),
	        rootTag = rootEls[tagName] || GENERIC,
	        el = mkEl(rootTag)
	
	    el.stub = true
	
	    if (checkIE && tagName && (match = tagName.match(SPECIAL_TAGS_REGEX)))
	      ie9elem(el, html, tagName, !!match[1])
	    else
	      el.innerHTML = html
	
	    return el
	  }
	
	  // creates tr, th, td, option, optgroup element for IE8-9
	  /* istanbul ignore next */
	  function ie9elem(el, html, tagName, select) {
	
	    var div = mkEl(GENERIC),
	        tag = select ? 'select>' : 'table>',
	        child
	
	    div.innerHTML = '<' + tag + html + '</' + tag
	
	    child = div.getElementsByTagName(tagName)[0]
	    if (child)
	      el.appendChild(child)
	
	  }
	  // end ie9elem()
	
	  return _mkdom
	
	})(IE_VERSION)
	
	// { key, i in items} -> { key, i, items }
	function loopKeys(expr) {
	  var b0 = brackets(0),
	      els = expr.trim().slice(b0.length).match(/^\s*(\S+?)\s*(?:,\s*(\S+))?\s+in\s+(.+)$/)
	  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
	}
	
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}
	
	
	/* Beware: heavy stuff */
	function _each(dom, parent, expr) {
	
	  remAttr(dom, 'each')
	
	  var tagName = getTagName(dom),
	      template = dom.outerHTML,
	      hasImpl = !!tagImpl[tagName],
	      impl = tagImpl[tagName] || {
	        tmpl: template
	      },
	      root = dom.parentNode,
	      placeholder = document.createComment('riot placeholder'),
	      tags = [],
	      child = getTag(dom),
	      checksum
	
	  root.insertBefore(placeholder, dom)
	
	  expr = loopKeys(expr)
	
	  // clean template code
	  parent
	    .one('premount', function () {
	      if (root.stub) root = parent.root
	      // remove the original DOM node
	      dom.parentNode.removeChild(dom)
	    })
	    .on('update', function () {
	      var items = tmpl(expr.val, parent)
	
	      // object loop. any changes cause full redraw
	      if (!isArray(items)) {
	
	        checksum = items ? JSON.stringify(items) : ''
	
	        items = !items ? [] :
	          Object.keys(items).map(function (key) {
	            return mkitem(expr, key, items[key])
	          })
	      }
	
	      var frag = document.createDocumentFragment(),
	          i = tags.length,
	          j = items.length
	
	      // unmount leftover items
	      while (i > j) {
	        tags[--i].unmount()
	        tags.splice(i, 1)
	      }
	
	      for (i = 0; i < j; ++i) {
	        var _item = !checksum && !!expr.key ? mkitem(expr, items[i], i) : items[i]
	
	        if (!tags[i]) {
	          // mount new
	          (tags[i] = new Tag(impl, {
	              parent: parent,
	              isLoop: true,
	              hasImpl: hasImpl,
	              root: SPECIAL_TAGS_REGEX.test(tagName) ? root : dom.cloneNode(),
	              item: _item
	            }, dom.innerHTML)
	          ).mount()
	
	          frag.appendChild(tags[i].root)
	        } else
	          tags[i].update(_item)
	
	        tags[i]._item = _item
	
	      }
	
	      root.insertBefore(frag, placeholder)
	
	      if (child) parent.tags[tagName] = tags
	
	    }).one('updated', function() {
	      var keys = Object.keys(parent)// only set new values
	      walk(root, function(node) {
	        // only set element node and not isLoop
	        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
	          node._visited = false // reset _visited for loop node
	          node._looped = true // avoid set multiple each
	          setNamed(node, parent, keys)
	        }
	      })
	    })
	
	}
	
	
	function parseNamedElements(root, tag, childTags) {
	
	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0
	
	      // custom child tag
	      var child = getTag(dom)
	
	      if (child && !dom.isLoop) {
	        childTags.push(initChildTag(child, dom, tag))
	      }
	
	      if (!dom.isLoop)
	        setNamed(dom, tag, [])
	    }
	
	  })
	
	}
	
	function parseExpressions(root, tag, expressions) {
	
	  function addExpr(dom, val, extra) {
	    if (val.indexOf(brackets(0)) >= 0) {
	      var expr = { dom: dom, expr: val }
	      expressions.push(extend(expr, extra))
	    }
	  }
	
	  walk(root, function(dom) {
	    var type = dom.nodeType
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    var attr = dom.getAttribute('each')
	
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]
	
	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }
	
	    })
	
	    // skip custom tags
	    if (getTag(dom)) return false
	
	  })
	
	}
	function Tag(impl, conf, innerHTML) {
	
	  var self = riot.observable(this),
	      opts = inherit(conf.opts) || {},
	      dom = mkdom(impl.tmpl),
	      parent = conf.parent,
	      isLoop = conf.isLoop,
	      hasImpl = conf.hasImpl,
	      item = cleanUpData(conf.item),
	      expressions = [],
	      childTags = [],
	      root = conf.root,
	      fn = impl.fn,
	      tagName = root.tagName.toLowerCase(),
	      attr = {},
	      propsInSyncWithParent = []
	
	  if (fn && root._tag) {
	    root._tag.unmount(true)
	  }
	
	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop
	
	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this
	
	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  this._id = __uid++
	
	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)
	
	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (brackets(/{.*}/).test(val)) attr[el.name] = val
	  })
	
	  if (dom.innerHTML && !/^(select|optgroup|table|tbody|tr|col(?:group)?)$/.test(tagName))
	    // replace all the yield tags with the tag inner html
	    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)
	
	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self
	
	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      opts[el.name] = tmpl(el.value, ctx)
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[name] = tmpl(attr[name], ctx)
	    })
	  }
	
	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF)
	        self[key] = data[key]
	    }
	  }
	
	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !~RESERVED_WORDS_BLACKLIST.indexOf(k) && ~propsInSyncWithParent.indexOf(k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }
	
	  this.update = function(data) {
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && typeof item === T_OBJECT) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	    self.trigger('updated')
	  }
	
	  this.mixin = function() {
	    each(arguments, function(mix) {
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	      each(Object.keys(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
	      })
	      // init method will be called automatically
	      if (mix.init) mix.init.bind(self)()
	    })
	  }
	
	  this.mount = function() {
	
	    updateOpts()
	
	    // initialiation
	    if (fn) fn.call(self, opts)
	
	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)
	
	    // mount the child tags
	    toggle(true)
	
	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs || hasImpl) {
	      walkAttributes(impl.attrs, function (k, v) { root.setAttribute(k, v) })
	      parseExpressions(self.root, self, expressions)
	    }
	
	    if (!self.parent || isLoop) self.update(item)
	
	    // internal use only, fixes #403
	    self.trigger('premount')
	
	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      self.root = root = dom.firstChild
	
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) self.root = root = parent.root
	    }
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  }
	
	
	  this.unmount = function(keepRootTag) {
	    var el = root,
	        p = el.parentNode,
	        ptag
	
	    if (p) {
	
	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._id == self._id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }
	
	      else
	        while (el.firstChild) el.removeChild(el.firstChild)
	
	      if (!keepRootTag)
	        p.removeChild(el)
	      else
	        // the riot-tag attribute isn't needed anymore, remove it
	        p.removeAttribute('riot-tag')
	    }
	
	
	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    // somehow ie8 does not like `delete root._tag`
	    root._tag = null
	
	  }
	
	  function toggle(isMount) {
	
	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })
	
	    // listen/unlisten parent (events flow one way from parent to children)
	    if (parent) {
	      var evt = isMount ? 'on' : 'off'
	
	      // the loop tags will be always in sync with the parent automatically
	      if (isLoop)
	        parent[evt]('unmount', self.unmount)
	      else
	        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
	    }
	  }
	
	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)
	
	
	}
	
	function setEventHandler(name, handler, dom, tag) {
	
	  dom[name] = function(e) {
	
	    var item = tag._item,
	        ptag = tag.parent,
	        el
	
	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag.parent
	      }
	
	    // cross browser event fix
	    e = e || window.event
	
	    // ignore error on some browsers
	    try {
	      e.currentTarget = dom
	      if (!e.target) e.target = e.srcElement
	      if (!e.which) e.which = e.charCode || e.keyCode
	    } catch (ignored) { /**/ }
	
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }
	
	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }
	
	  }
	
	}
	
	// used by if- attribute
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}
	
	function update(expressions, tag) {
	
	  each(expressions, function(expr, i) {
	
	    var dom = expr.dom,
	        attrName = expr.attr,
	        value = tmpl(expr.expr, tag),
	        parent = expr.dom.parentNode
	
	    if (expr.bool)
	      value = value ? attrName : false
	    else if (value == null)
	      value = ''
	
	    // leave out riot- prefixes from strings inside textarea
	    // fix #815: any value -> string
	    if (parent && parent.tagName == 'TEXTAREA') value = ('' + value).replace(/riot-/g, '')
	
	    // no change
	    if (expr.value === value) return
	    expr.value = value
	
	    // text node
	    if (!attrName) {
	      dom.nodeValue = '' + value    // #815 related
	      return
	    }
	
	    // remove original attribute
	    remAttr(dom, attrName)
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)
	
	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	          add = function() { insertTo(stub.parentNode, stub, dom) },
	          remove = function() { insertTo(dom.parentNode, dom, stub) }
	
	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        else
	        // otherwise we need to wait the updated event
	          (tag.parent || tag).one('updated', remove)
	
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (/^(show|hide)$/.test(attrName)) {
	      if (attrName == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'
	
	    // field value
	    } else if (attrName == 'value') {
	      dom.value = value
	
	    // <img src="{ expr }">
	    } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	      if (value)
	        dom.setAttribute(attrName.slice(RIOT_PREFIX.length), value)
	
	    } else {
	      if (expr.bool) {
	        dom[attrName] = value
	        if (!value) return
	      }
	
	      if (typeof value !== T_OBJECT) dom.setAttribute(attrName, value)
	
	    }
	
	  })
	
	}
	function each(els, fn) {
	  for (var i = 0, len = (els || []).length, el; i < len; i++) {
	    el = els[i]
	    // return false -> remove current item during loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}
	
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}
	
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	function getTag(dom) {
	  return dom.tagName && tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	
	function initChildTag(child, dom, parent) {
	  var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
	      tagName = getTagName(dom),
	      ptag = getImmediateCustomParentTag(parent),
	      cachedTag
	
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	
	  cachedTag = ptag.tags[tagName]
	
	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      ptag.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!~ptag.tags[tagName].indexOf(tag))
	      ptag.tags[tagName].push(tag)
	  } else {
	    ptag.tags[tagName] = tag
	  }
	
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  dom.innerHTML = ''
	
	  return tag
	}
	
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}
	
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = dom.getAttribute('name'),
	    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child ? child.name : dom.tagName.toLowerCase()
	
	  return tagName
	}
	
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if ((obj = args[i])) {
	      for (var key in obj) {      // eslint-disable-line guard-for-in
	        src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}
	
	// with this function we avoid that the current Tag methods get overridden
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data
	
	  var o = {}
	  for (var key in data) {
	    if (!~RESERVED_WORDS_BLACKLIST.indexOf(key))
	      o[key] = data[key]
	  }
	  return o
	}
	
	function walk(dom, fn) {
	  if (dom) {
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild
	
	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}
	
	// minimize risk: only zero or one _space_ between attr & value
	function walkAttributes(html, fn) {
	  var m,
	      re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g
	
	  while ((m = re.exec(html))) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}
	
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}
	
	function mkEl(name) {
	  return document.createElement(name)
	}
	
	function replaceYield(tmpl, innerHTML) {
	  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gi, innerHTML || '')
	}
	
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}
	
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}
	
	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}
	
	function setNamed(dom, parent, keys) {
	  if (dom._visited) return
	  var p,
	      v = dom.getAttribute('id') || dom.getAttribute('name')
	
	  if (v) {
	    if (keys.indexOf(v) < 0) {
	      p = parent[v]
	      if (!p)
	        parent[v] = dom
	      else if (isArray(p))
	        p.push(dom)
	      else
	        parent[v] = [p, dom]
	    }
	    dom._visited = true
	  }
	}
	
	// faster String startsWith alternative
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}
	
	/*
	 Virtual dom is an array of custom tags on the document.
	 Updates and unmounts propagate downwards from parent to children.
	*/
	
	var virtualDom = [],
	    tagImpl = {},
	    styleNode
	
	function injectStyle(css) {
	
	  if (riot.render) return // skip injection on the server
	
	  if (!styleNode) {
	    styleNode = mkEl('style')
	    styleNode.setAttribute('type', 'text/css')
	  }
	
	  var head = document.head || document.getElementsByTagName('head')[0]
	
	  if (styleNode.styleSheet)
	    styleNode.styleSheet.cssText += css
	  else
	    styleNode.innerHTML += css
	
	  if (!styleNode._rendered)
	    if (styleNode.styleSheet) {
	      document.body.appendChild(styleNode)
	    } else {
	      var rs = $('style[type=riot]')
	      if (rs) {
	        rs.parentNode.insertBefore(styleNode, rs)
	        rs.parentNode.removeChild(rs)
	      } else head.appendChild(styleNode)
	
	    }
	
	  styleNode._rendered = true
	
	}
	
	function mountTo(root, tagName, opts) {
	  var tag = tagImpl[tagName],
	      // cache the inner HTML to fix #855
	      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
	
	  // clear the inner html
	  root.innerHTML = ''
	
	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)
	
	  if (tag && tag.mount) {
	    tag.mount()
	    virtualDom.push(tag)
	    return tag.on('unmount', function() {
	      virtualDom.splice(virtualDom.indexOf(tag), 1)
	    })
	  }
	
	}
	
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else injectStyle(css)
	  }
	  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	riot.mount = function(selector, tagName, opts) {
	
	  var els,
	      allTags,
	      tags = []
	
	  // helper functions
	
	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      list += ', *[' + RIOT_TAG + '="' + e.trim() + '"]'
	    })
	    return list
	  }
	
	  function selectAllTags() {
	    var keys = Object.keys(tagImpl)
	    return keys + addRiotTags(keys)
	  }
	
	  function pushTags(root) {
	    var last
	    if (root.tagName) {
	      if (tagName && (!(last = root.getAttribute(RIOT_TAG)) || last != tagName))
	        root.setAttribute(RIOT_TAG, tagName)
	
	      var tag = mountTo(root,
	        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)
	
	      if (tag) tags.push(tag)
	    }
	    else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }
	
	  // ----- mount code -----
	
	  if (typeof tagName === T_OBJECT) {
	    opts = tagName
	    tagName = 0
	  }
	
	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(','))
	
	    els = $$(selector)
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector
	
	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }
	
	  if (els.tagName)
	    pushTags(els)
	  else
	    each(els, pushTags)
	
	  return tags
	}
	
	// update everything
	riot.update = function() {
	  return each(virtualDom, function(tag) {
	    tag.update()
	  })
	}
	
	// @deprecated
	riot.mountTo = riot.mount
	
	  // share methods for other riot parts, e.g. compiler
	  riot.util = { brackets: brackets, tmpl: tmpl }
	
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return (window.riot = riot) }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot
	
	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(3);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _riot = __webpack_require__(1);
	
	var _riot2 = _interopRequireDefault(_riot);
	
	var _stores = __webpack_require__(4);
	
	var store = _interopRequireWildcard(_stores);
	
	var StoreMixin = {
		getStore: function getStore() {
			return store.getState();
		},
	
		onStoreUpdate: function onStoreUpdate(attr, fn) {
			var lastState = store.getState()[attr];
			store.subscribe(function () {
				var state = store.getState()[attr];
				if (lastState !== state) fn(state);
				lastState = state;
			});
		},
	
		trackStateFromStore: function trackStateFromStore(attr) {
			this.onStoreUpdate(attr, (function (state) {
				this[attr] = state;
				this.update();
			}).bind(this));
			this[attr] = store.getState()[attr];
		}
	};
	
	_riot2['default'].mixin('store', StoreMixin);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _usersJs = __webpack_require__(5);
	
	var _redux = __webpack_require__(18);
	
	var _reduxThunk = __webpack_require__(28);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _reduxLogger = __webpack_require__(29);
	
	var _reduxLogger2 = _interopRequireDefault(_reduxLogger);
	
	var _reduxPromise = __webpack_require__(30);
	
	var _reduxPromise2 = _interopRequireDefault(_reduxPromise);
	
	var logger = (0, _reduxLogger2['default'])();
	var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2['default'], _reduxPromise2['default'], logger)(_redux.createStore);
	var store = createStoreWithMiddleware(_usersJs.users);
	
	module.exports = store;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	var _reduxActions = __webpack_require__(6);
	
	var ids = 0;
	function createId() {
	  return "user-" + ids++;
	}
	
	var users = (0, _reduxActions.handleActions)({
	
	  ADD_USER: function ADD_USER(state, action) {
	    return {
	      users: [].concat(_toConsumableArray(state.users), [{ name: action.payload.name, id: createId() }])
	    };
	  },
	
	  REMOVE_USER_BY_ID: function REMOVE_USER_BY_ID(state, action) {
	    return { users: state.users.filter(function (user) {
	        return user.id !== action.payload.id;
	      }) };
	  },
	
	  LOAD_USERS: function LOAD_USERS(state, _ref) {
	    var payload = _ref.payload;
	    return payload;
	  },
	
	  REMOVE_ALL_USERS: function REMOVE_ALL_USERS() {
	    return { users: [] };
	  }
	
	}, { users: [] });
	exports.users = users;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createAction = __webpack_require__(7);
	
	var _createAction2 = _interopRequireDefault(_createAction);
	
	var _handleAction = __webpack_require__(8);
	
	var _handleAction2 = _interopRequireDefault(_handleAction);
	
	var _handleActions = __webpack_require__(15);
	
	var _handleActions2 = _interopRequireDefault(_handleActions);
	
	exports.createAction = _createAction2['default'];
	exports.handleAction = _handleAction2['default'];
	exports.handleActions = _handleActions2['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createAction;
	function identity(t) {
	  return t;
	}
	
	function createAction(type, actionCreator, metaCreator) {
	  var finalActionCreator = typeof actionCreator === 'function' ? actionCreator : identity;
	
	  return function () {
	    var action = {
	      type: type,
	      payload: finalActionCreator.apply(undefined, arguments)
	    };
	
	    if (typeof metaCreator === 'function') action.meta = metaCreator.apply(undefined, arguments);
	
	    return action;
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = handleAction;
	
	var _fluxStandardAction = __webpack_require__(9);
	
	function isFunction(val) {
	  return typeof val === 'function';
	}
	
	function handleAction(type, reducers) {
	  return function (state, action) {
	    // If action type does not match, return previous state
	    if (action.type !== type) return state;
	
	    var handlerKey = _fluxStandardAction.isError(action) ? 'throw' : 'next';
	
	    // If function is passed instead of map, use as reducer
	    if (isFunction(reducers)) {
	      reducers.next = reducers;
	    }
	
	    // Otherwise, assume an action map was passed
	    var reducer = reducers[handlerKey];
	
	    return isFunction(reducer) ? reducer(state, action) : state;
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.isFSA = isFSA;
	exports.isError = isError;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashIsplainobject = __webpack_require__(10);
	
	var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);
	
	var validKeys = ['type', 'payload', 'error', 'meta'];
	
	function isValidKey(key) {
	  return validKeys.indexOf(key) > -1;
	}
	
	function isFSA(action) {
	  return _lodashIsplainobject2['default'](action) && typeof action.type !== 'undefined' && Object.keys(action).every(isValidKey);
	}
	
	function isError(action) {
	  return action.error === true;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseFor = __webpack_require__(11),
	    isArguments = __webpack_require__(12),
	    keysIn = __webpack_require__(13);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  var Ctor;
	
	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
	      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return result === undefined || hasOwnProperty.call(value, result);
	}
	
	module.exports = isPlainObject;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = baseFor;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}
	
	module.exports = isArguments;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var isArguments = __webpack_require__(12),
	    isArray = __webpack_require__(14);
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isArray;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = handleActions;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _handleAction = __webpack_require__(8);
	
	var _handleAction2 = _interopRequireDefault(_handleAction);
	
	var _ownKeys = __webpack_require__(16);
	
	var _ownKeys2 = _interopRequireDefault(_ownKeys);
	
	var _reduceReducers = __webpack_require__(17);
	
	var _reduceReducers2 = _interopRequireDefault(_reduceReducers);
	
	function handleActions(handlers, defaultState) {
	  var reducers = _ownKeys2['default'](handlers).map(function (type) {
	    return _handleAction2['default'](type, handlers[type]);
	  });
	
	  return typeof defaultState !== 'undefined' ? function (state, action) {
	    if (state === undefined) state = defaultState;
	    return _reduceReducers2['default'].apply(undefined, reducers)(state, action);
	  } : _reduceReducers2['default'].apply(undefined, reducers);
	}
	
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = ownKeys;
	
	function ownKeys(object) {
	  if (typeof Reflect !== 'undefined') {
	    return Reflect.ownKeys(object);
	  }
	
	  var keys = Object.getOwnPropertyNames(object);
	
	  if (typeof Object.getOwnPropertySymbols === 'function') {
	    keys = keys.concat(Object.getOwnPropertySymbols(object));
	  }
	
	  return keys;
	}
	
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = reduceReducers;
	
	function reduceReducers() {
	  for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {
	    reducers[_key] = arguments[_key];
	  }
	
	  return function (previous, current) {
	    return reducers.reduce(function (p, r) {
	      return r(p, current);
	    }, previous);
	  };
	}
	
	module.exports = exports["default"];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(19);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _utilsCombineReducers = __webpack_require__(21);
	
	var _utilsCombineReducers2 = _interopRequireDefault(_utilsCombineReducers);
	
	var _utilsBindActionCreators = __webpack_require__(25);
	
	var _utilsBindActionCreators2 = _interopRequireDefault(_utilsBindActionCreators);
	
	var _utilsApplyMiddleware = __webpack_require__(26);
	
	var _utilsApplyMiddleware2 = _interopRequireDefault(_utilsApplyMiddleware);
	
	var _utilsCompose = __webpack_require__(27);
	
	var _utilsCompose2 = _interopRequireDefault(_utilsCompose);
	
	exports.createStore = _createStore2['default'];
	exports.combineReducers = _utilsCombineReducers2['default'];
	exports.bindActionCreators = _utilsBindActionCreators2['default'];
	exports.applyMiddleware = _utilsApplyMiddleware2['default'];
	exports.compose = _utilsCompose2['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createStore;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsIsPlainObject = __webpack_require__(20);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	
	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	
	    return function unsubscribe() {
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};
	
	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	
	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }
	
	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;
	
	  if (proto === null) {
	    return true;
	  }
	
	  var constructor = proto.constructor;
	
	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
	}
	
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _createStore = __webpack_require__(19);
	
	var _utilsIsPlainObject = __webpack_require__(20);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	var _utilsMapValues = __webpack_require__(23);
	
	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);
	
	var _utilsPick = __webpack_require__(24);
	
	var _utilsPick2 = _interopRequireDefault(_utilsPick);
	
	/* eslint-disable no-console */
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateKeyWarningMessage(inputState, outputState, action) {
	  var reducerKeys = Object.keys(outputState);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!_utilsIsPlainObject2['default'](inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return reducerKeys.indexOf(key) < 0;
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	
	function combineReducers(reducers) {
	  var finalReducers = _utilsPick2['default'](reducers, function (val) {
	    return typeof val === 'function';
	  });
	  var sanityError;
	
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  var defaultState = _utilsMapValues2['default'](finalReducers, function () {
	    return undefined;
	  });
	
	  return function combination(state, action) {
	    if (state === undefined) state = defaultState;
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    var finalState = _utilsMapValues2['default'](finalReducers, function (reducer, key) {
	      var newState = reducer(state[key], action);
	      if (typeof newState === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      return newState;
	    });
	
	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateKeyWarningMessage(state, finalState, action);
	      if (warningMessage) {
	        console.error(warningMessage);
	      }
	    }
	
	    return finalState;
	  };
	}
	
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ },
/* 22 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Applies a function to every key-value pair inside an object.
	 *
	 * @param {Object} obj The source object.
	 * @param {Function} fn The mapper function that receives the value and the key.
	 * @returns {Object} A new object that contains the mapped values for the keys.
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = mapValues;
	
	function mapValues(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    result[key] = fn(obj[key], key);
	    return result;
	  }, {});
	}
	
	module.exports = exports["default"];

/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * Picks key-value pairs from an object where values satisfy a predicate.
	 *
	 * @param {Object} obj The object to pick from.
	 * @param {Function} fn The predicate the values must satisfy to be copied.
	 * @returns {Object} The object with the values that satisfied the predicate.
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = pick;
	
	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key];
	    }
	    return result;
	  }, {});
	}
	
	module.exports = exports["default"];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsMapValues = __webpack_require__(23);
	
	var _utilsMapValues2 = _interopRequireDefault(_utilsMapValues);
	
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
	    // eslint-disable-line no-eq-null
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  return _utilsMapValues2['default'](actionCreators, function (actionCreator) {
	    return bindActionCreator(actionCreator, dispatch);
	  });
	}
	
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = applyMiddleware;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compose = __webpack_require__(27);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  return function (arg) {
	    return funcs.reduceRight(function (composed, f) {
	      return f(composed);
	    }, arg);
	  };
	}
	
	module.exports = exports["default"];

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = thunkMiddleware;
	
	function thunkMiddleware(_ref) {
	  var dispatch = _ref.dispatch;
	  var getState = _ref.getState;
	
	  return function (next) {
	    return function (action) {
	      return typeof action === 'function' ? action(dispatch, getState) : next(action);
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var repeat = function repeat(str, times) {
	  return new Array(times + 1).join(str);
	};
	var pad = function pad(num, maxLength) {
	  return repeat("0", maxLength - num.toString().length) + num;
	};
	
	// Use the new performance api to get better precision if available
	var timer = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;
	
	/**
	 * Creates logger with followed options
	 *
	 * @namespace
	 * @property {object} options - options for logger
	 * @property {string} options.level - console[level]
	 * @property {object} options.logger - implementation of the `console` API.
	 * @property {boolean} options.collapsed - is group collapsed?
	 * @property {boolean} options.predicate - condition which resolves logger behavior
	 * @property {bool} options.duration - print duration of each action?
	 * @property {bool} options.timestamp - print timestamp with each action?
	 * @property {function} options.transformer - transform state before print
	 * @property {function} options.actionTransformer - transform action before print
	 */
	
	function createLogger() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  return function (_ref) {
	    var getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        var level = options.level;
	        var logger = options.logger;
	        var collapsed = options.collapsed;
	        var predicate = options.predicate;
	        var _options$duration = options.duration;
	        var duration = _options$duration === undefined ? false : _options$duration;
	        var _options$timestamp = options.timestamp;
	        var timestamp = _options$timestamp === undefined ? true : _options$timestamp;
	        var _options$transformer = options.transformer;
	        var transformer = _options$transformer === undefined ? function (state) {
	          return state;
	        } : _options$transformer;
	        var _options$actionTransformer = options.actionTransformer;
	        var actionTransformer = _options$actionTransformer === undefined ? function (actn) {
	          return actn;
	        } : _options$actionTransformer;
	
	        var console = logger || window.console;
	
	        // exit if console undefined
	        if (typeof console === "undefined") {
	          return next(action);
	        }
	
	        // exit early if predicate function returns false
	        if (typeof predicate === "function" && !predicate(getState, action)) {
	          return next(action);
	        }
	
	        var started = timer.now();
	        var prevState = transformer(getState());
	
	        var returnValue = next(action);
	        var took = timer.now() - started;
	
	        var nextState = transformer(getState());
	
	        // formatters
	        var time = new Date();
	        var isCollapsed = typeof collapsed === "function" ? collapsed(getState, action) : collapsed;
	
	        var formattedTime = timestamp ? " @ " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3) : "";
	        var formattedDuration = duration ? " in " + took.toFixed(2) + " ms" : "";
	        var formattedAction = actionTransformer(action);
	        var message = "action " + formattedAction.type + formattedTime + formattedDuration;
	        var startMessage = isCollapsed ? console.groupCollapsed : console.group;
	
	        // render
	        try {
	          startMessage.call(console, message);
	        } catch (e) {
	          console.log(message);
	        }
	
	        if (level) {
	          console[level]("%c prev state", "color: #9E9E9E; font-weight: bold", prevState);
	          console[level]("%c action", "color: #03A9F4; font-weight: bold", formattedAction);
	          console[level]("%c next state", "color: #4CAF50; font-weight: bold", nextState);
	        } else {
	          console.log("%c prev state", "color: #9E9E9E; font-weight: bold", prevState);
	          console.log("%c action", "color: #03A9F4; font-weight: bold", formattedAction);
	          console.log("%c next state", "color: #4CAF50; font-weight: bold", nextState);
	        }
	
	        try {
	          console.groupEnd();
	        } catch (e) {
	          console.log("—— log end ——");
	        }
	
	        return returnValue;
	      };
	    };
	  };
	}
	
	exports["default"] = createLogger;
	module.exports = exports["default"];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = promiseMiddleware;
	
	var _fluxStandardAction = __webpack_require__(31);
	
	function isPromise(val) {
	  return val && typeof val.then === 'function';
	}
	
	function promiseMiddleware(_ref) {
	  var dispatch = _ref.dispatch;
	
	  return function (next) {
	    return function (action) {
	      if (!_fluxStandardAction.isFSA(action)) {
	        return isPromise(action) ? action.then(dispatch) : next(action);
	      }
	      return isPromise(action.payload) ? action.payload.then(function (result) {
	        return dispatch(_extends({}, action, { payload: result }));
	      }, function (error) {
	        return dispatch(_extends({}, action, { payload: error, error: true }));
	      }) : next(action);
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.isFSA = isFSA;
	exports.isError = isError;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashIsplainobject = __webpack_require__(32);
	
	var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);
	
	var validKeys = ['type', 'payload', 'error', 'meta'];
	
	function isValidKey(key) {
	  return validKeys.indexOf(key) > -1;
	}
	
	function isFSA(action) {
	  return _lodashIsplainobject2['default'](action) && typeof action.type !== 'undefined' && Object.keys(action).every(isValidKey);
	}
	
	function isError(action) {
	  return action.error === true;
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseFor = __webpack_require__(33),
	    isArguments = __webpack_require__(34),
	    keysIn = __webpack_require__(35);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  var Ctor;
	
	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
	      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return result === undefined || hasOwnProperty.call(value, result);
	}
	
	module.exports = isPlainObject;


/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = baseFor;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}
	
	module.exports = isArguments;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var isArguments = __webpack_require__(34),
	    isArray = __webpack_require__(36);
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 36 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isArray;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(38);
	
	__webpack_require__(39);

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var riot = __webpack_require__(1);
	
	riot.tag('app', '<users></users>', function(opts) {
	
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var riot = __webpack_require__(1);
	
	var store = __webpack_require__(4);
	var loadUsers = __webpack_require__(40).loadUsers;
	
	riot.tag('users', '<h1>Users</h1><div><button onclick="{loadUsers}">Load users</button><button onclick="{removeAll}">Remove all</button></div><br><div><input name="userName" placeholder="Add an user name" onkeydown="{this.keydown}"></div><ul><li each="{user in this.users}">{user.name} <a href="#" onclick="{this.remove}" data-user="{user.id}">x</a></li></ul>', function(opts) {
	
		this.keydown = function(e) {
			if (e.keyCode === 13) {
				store.dispatch({ type: 'ADD_USER', payload: {name: this.userName.value }});
				this.userName.value = "";
			}
			return true;
		}.bind(this);
	
		this.remove = function(e) {
			store.dispatch({ type: 'REMOVE_USER_BY_ID', payload: {id: e.target.getAttribute('data-user') }});
		}.bind(this);
	
		this.removeAll = function() {
			store.dispatch({ type: 'REMOVE_ALL_USERS'});
		}.bind(this);
	
		this.mixin('store');
		this.trackStateFromStore('users');
		this.loadUsers = loadUsers;
	
	
	});


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(fetch) {'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.loadUsers = loadUsers;
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _stores = __webpack_require__(4);
	
	var store = _interopRequireWildcard(_stores);
	
	function loadUsers() {
	  var users = fetch('http://api.randomuser.me/?seed=riot-router&results=30').then(function (response) {
	    return response.json();
	  }).then(function (_ref) {
	    var results = _ref.results;
	
	    return results.map(function (_ref2) {
	      var user = _ref2.user;
	
	      return {
	        id: user.md5,
	        name: user.name.first + " " + user.name.last
	      };
	    });
	  }).then(function (users) {
	    return { users: users };
	  });
	  store.dispatch({ type: 'LOAD_USERS', payload: users });
	  return users;
	}
	
	window.loadUsers = loadUsers;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(41)))

/***/ },
/* 41 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	(function() {
	
	(function() {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return;
	      }
	
	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();
	
	
	/*** EXPORTS FROM exports-loader ***/
	module.exports = global.fetch}.call(global));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(1));
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
		
		var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
		
		function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
		
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
		    this.current = new Context("").response;
		    this.process = this.process.bind(this);
		  }
		
		  Router.prototype.route = function route(handler) {
		    this.handler = handler;
		  };
		
		  Router.prototype.routes = function routes(_routes) {
		    this.route(new InitialRoute().routes(_routes));
		  };
		
		  Router.prototype.use = function use(interceptor) {
		    this.interceptors.push(interceptor);
		  };
		
		  Router.prototype.process = function process() {
		    var params = Array.prototype.slice.call(arguments);
		    var uri = params.join("/");
		    if (uri[0] !== '/') uri = "/" + uri; // handle '#any' as '#/any'
		    var context = new Context(uri);
		    if (!this.rootContext) this.rootContext = context;
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
		      this.rootContext = null;
		      this.trigger('route:updated', response);
		      return context;
		    }
		  };
		
		  Router.prototype.isRedirect = function isRedirect(context) {
		    return !!context.response.redirectTo;
		  };
		
		  Router.prototype.processRedirect = function processRedirect(context) {
		    var uri = context.response.redirectTo;
		    this.rootContext.addRedirect(uri);
		    this.navigateTo(uri);
		  };
		
		  Router.prototype.navigateTo = function navigateTo(uri) {
		    riot.route(uri);
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
		
		  Context.prototype.addRedirect = function addRedirect(uri) {
		    if (this.redirectStack.indexOf(uri) > -1) throw new Error("Cyclic redirection to " + uri + ". Stack = " + this.redirectStack);
		    this.redirectStack.push(uri);
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
		    if (!matcher) return this.routeMiss(request, response);
		    return this.routeMatch(request, response, matcher);
		  };
		
		  Handler.prototype.routeMatch = function routeMatch(request, response, matcher) {
		    response.add(matcher);
		    return true;
		  };
		
		  Handler.prototype.routeMiss = function routeMiss(request, response) {
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
		  _inherits(Route, _Handler);
		
		  function Route(options) {
		    _classCallCheck(this, Route);
		
		    _Handler.call(this, options);
		    options = options || {};
		    this.tag = options.tag;
		    this.api = options.api;
		    this.path = options.path;
		    this.name = options.name;
		    this.updatable = options.updatable;
		    this.pathParameterNames = [];
		    var path = this.getPath().replace(/^\//, "");
		    this.pattern = "^/?" + path.replace(/:([^/]+)/g, (function (ignored, group) {
		      this.pathParameterNames.push(group);
		      return "([^/]+)";
		    }).bind(this)) + "(:?/|$)";
		    this.regex = new RegExp(this.pattern);
		  }
		
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
		    if (notFoundRoutes.length > 1) error("Can't use more than one NotFoundRoute per route. --> " + this.getPath());
		    if (defaultRoutes.length > 1) error("Can't use more than one DefaultRoute per route. --> " + this.getPath());
		    this._routes = [].concat(redirectRoutes).concat(otherRoutes).concat(defaultRoutes).concat(notFoundRoutes);
		    return this;
		  };
		
		  Route.prototype.matches = function matches(request) {
		    var matcher = this.regex.exec(request.uri);
		    if (matcher) {
		      var params = {};
		      for (var i in this.pathParameterNames) {
		        var name = this.pathParameterNames[i];
		        params[name] = decodeURIComponent(matcher[parseInt(i, 10) + 1]);
		      }
		      return { route: this, tag: this.tag, api: this.api, found: matcher[0], params: params };
		    }
		    return false;
		  };
		
		  Route.prototype.routeMatch = function routeMatch(request, response, matcher) {
		    var matches = _Handler.prototype.routeMatch.call(this, request, response, matcher);
		    this.processRoutes(request, response, matcher);
		    return matches;
		  };
		
		  Route.prototype.processRoutes = function processRoutes(request, response, matcher) {
		    return _Handler.prototype.processRoutes.call(this, this.createRequest(request, matcher), response, this._routes);
		  };
		
		  Route.prototype.getPath = function getPath() {
		    return this.name || this.path || (typeof this.tag === 'string' ? this.tag : '');
		  };
		
		  return Route;
		})(Handler);
		
		var InitialRoute = (function (_Route) {
		  _inherits(InitialRoute, _Route);
		
		  function InitialRoute() {
		    _classCallCheck(this, InitialRoute);
		
		    _Route.apply(this, arguments);
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
		
		    _Handler2.call(this, options);
		    options = options || {};
		    this.tag = options.tag;
		    this.api = options.api;
		  }
		
		  NotFoundRoute.prototype.matches = function matches(request) {
		    return { route: this, tag: this.tag, api: this.api, found: request.uri };
		  };
		
		  return NotFoundRoute;
		})(Handler);
		
		var RedirectRoute = (function (_Handler3) {
		  _inherits(RedirectRoute, _Handler3);
		
		  function RedirectRoute(options) {
		    _classCallCheck(this, RedirectRoute);
		
		    _Handler3.call(this, options);
		    options = options || {};
		    this.from = options.from;
		    this.to = options.to;
		    this.pattern = "(^/?)" + this.from + "(/|$)";
		    this.regex = new RegExp(this.pattern);
		  }
		
		  RedirectRoute.prototype.process = function process(request, response) {
		    var uri = request.uri.replace(this.regex, "$1" + this.to + "$2");
		    if (uri !== request.uri) {
		      var parent = request.parentUri || "";
		      response.redirectTo = parent + uri;
		      return true;
		    }
		  };
		
		  return RedirectRoute;
		})(Handler);
		
		var DefaultRoute = (function (_Handler4) {
		  _inherits(DefaultRoute, _Handler4);
		
		  function DefaultRoute(options) {
		    _classCallCheck(this, DefaultRoute);
		
		    _Handler4.call(this, options);
		    options = options || {};
		    this.tag = options.tag;
		    this.api = options.api;
		  }
		
		  DefaultRoute.prototype.matches = function matches(request) {
		    var uri = request.uri.trim();
		    if (uri === "/" || uri === "") return { route: this, tag: this.tag, api: this.api, found: uri };
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
		      }
		    }
		  };
		
		  this.canUpdate = function (tag, api, options) {
		    if (!riot.router.config.updatable && !opts.updatable && !options.updatable || !this.instance || !this.instance.isMounted || this.instanceTag !== tag) return false;
		    return true;
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
		          mount = { tag: matcher.tag, api: api, updatable: matcher.route.updatable };
		        }
		      }
		    }
		    this.mountTag(mount.tag, mount.api, mount);
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
		
		router.config = {
		  updatable: false
		};
		
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=app.js.map