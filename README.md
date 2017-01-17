[![npm package](https://img.shields.io/npm/v/riot-router.svg?style=flat-square)](https://www.npmjs.org/package/riot-router)
[![build status](https://img.shields.io/travis/gabrielmoreira/riot-router/master.svg?style=flat-square)](https://travis-ci.org/gabrielmoreira/riot-router)
[![dependency status](https://img.shields.io/david/gabrielmoreira/riot-router.svg?style=flat-square)](https://david-dm.org/gabrielmoreira/riot-router)

A routing library for Riot.

Why
---

To make it easier to use Riot in SPA applications, I created this url routing library inspired by the React-Router API.

How?
----

First you create your riot tags:

```html
<script type="riot/tag">
  <user>
    <div>Hello user {opts.id}</div>
  </user>

  <users>
    <ul>
      <li><a href="#/user/A">Open user A</a></li>
      <li><a href="#/user/B">Open user B</a></li>
    </ul>
  </users>
</script>
```

Then you add Riot and Riot-Router to your page:

```html
<script src="https://unpkg.com/riot@3.0.7/riot+compiler.min.js"></script>
<script src="https://unpkg.com/riot-router@0.9.0/dist/router.min.js"></script>
```

And finally, you declare your routes and initialize your application:

```html
<script>
router.routes([
  new Router.Route({tag: 'user', path: '/user/:id'}),
  new Router.Route({tag: 'users'}),
  new Router.DefaultRoute({tag: 'app'})
])
riot.mount('*');
router.start();
</script>
```

Done!

[Veja um exemplo no jsFiddle](https://jsfiddle.net/gabrielmoreira/ygc1xcs9/3/)


Installation
------------

```sh
npm install riot-router
```

This library is written with CommonJS modules. If you are using
browserify, webpack, or similar, you can consume it like anything else
installed from npm.

See a demo
----------

[Application example](http://gabrielmoreira.github.io/riot-router/examples/example-01.html)

What's it look like?
--------------------

```js
var Route = Router.Route, 
    DefaultRoute = Router.DefaultRoute, 
    NotFoundRoute = Router.NotFoundRoute, 
    RedirectRoute = Router.RedirectRoute;

router.routes([
  new DefaultRoute({tag: 'home'}),
  new Route({tag: 'about'}),
  new Route({tag: 'users'}).routes([
     new Route({path:'top', tag: 'users-home', api: {text: 'Select a top user'}}),
     new Route({path: '/user/:userId', tag: 'user'}),
     new DefaultRoute({tag: 'users-home', api: {text: 'Select a user'}}),
     new NotFoundRoute({tag: 'not-found'})
   ]),
  new NotFoundRoute({tag: 'not-found'}),
  new RedirectRoute({from: 'company', to: 'about'}),
  new RedirectRoute({from: 'u', to: 'users/user'})
]);

riot.mount('*');
router.start();
```
