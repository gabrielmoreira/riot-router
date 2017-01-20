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
    <div>Hello user {opts.id} - {opts.name}</div>
  </user>

  <users>
    <ul>
      <li><a href="#/user/1?name=Roger">Open user 1 - Roger</a></li>
      <li><a href="#/user/2?name=That">Open user 2 - That</a></li>
    </ul>
  </users>
</script>
```

Then you add Riot and Riot-Router to your development page:

```html
<script src="https://unpkg.com/riot@3.0/riot+compiler.min.js"></script>
<script src="https://unpkg.com/riot-router@0.9/dist/router.min.js"></script>
```

Add this special tag in your page:

```html
<route></route>

or, if your prefer:

<div data-is="route"></div>
```

And finally, you declare your routes and initialize your application:

```html
<script>
router.routes([
  new Router.Route({tag: 'user', path: '/user/:id'}), // Named paths
  new Router.DefaultRoute({tag: 'users'})
])
riot.mount('*');
router.start();
</script>
```

Done!

[See a sample](https://jsbin.com/tihuki)

[See a todo sample with Redux](https://jsbin.com/jujobe) 

Installation
------------

```sh
npm install riot-router
```

This library is written with CommonJS modules. If you are using
browserify, webpack, or similar, you can consume it like anything else
installed from npm.

Advanced examples
-----------------

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
