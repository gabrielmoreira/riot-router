import riot from 'riot';
import './mixins';
import './tags';
import * as store from './stores/';
import {Route, DefaultRoute, NotFoundRoute, RedirectRoute} from 'riot-router/lib/router.js';

riot.router.routes([
  new DefaultRoute({tag: 'hello'}),
]);

// Mount all Riot tags.
riot.mount('*');

// Start routing
riot.router.start();

window.store = store;
