[![npm package](https://img.shields.io/npm/v/riot-router.svg?style=flat-square)](https://www.npmjs.org/package/riot-router)
[![build status](https://img.shields.io/travis/gabrielmoreira/riot-router/master.svg?style=flat-square)](https://travis-ci.org/gabrielmoreira/riot-router)
[![dependency status](https://img.shields.io/david/gabrielmoreira/riot-router.svg?style=flat-square)](https://david-dm.org/gabrielmoreira/riot-router)

A routing library for Riot.

Installation
------------

```sh
npm install riot-router
```

This library is written with CommonJS modules. If you are using
browserify, webpack, or similar, you can consume it like anything else
installed from npm.

See a demo
-------------

[Application example](http://gabrielmoreira.github.io/riot-router/examples/example-01.html)

What's it look like?
--------------------

```js
var Route = riot.router.Route, 
    DefaultRoute = riot.router.DefaultRoute, 
    NotFoundRoute = riot.router.NotFoundRoute, 
    RedirectRoute = riot.router.RedirectRoute;

riot.router.routes([
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
riot.router.start();
```

Thanks, React-Router
--------------------

This library is highly inspired by the React-Router routing API.
