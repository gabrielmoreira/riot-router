import riot from 'riot';
import './mixins';
import './tags';
import * as store from './stores/';
import {Route, DefaultRoute, NotFoundRoute, RedirectRoute} from 'riot-router/lib/router.js';

import {loadUsers} from './api/users.js';

loadUsers();

riot.router.routes([
  new Route({path: 'user/:id', tag: 'user'}),
  new DefaultRoute({tag: 'app'}),
]);

// Mount all Riot tags.
riot.mount('*');

// Start routing
riot.router.start();

window.store = store;
