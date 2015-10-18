import * as store from './stores';
import riot from 'riot';

// install mixins & tags
import './mixins';
import './tags';

// install router state
import './utils/router.state.js';

// app routes
import {Route, DefaultRoute, NotFoundRoute, RedirectRoute} from 'riot-router/lib/router.js';

riot.router.routes([
  new Route({path: 'user/:id', tag: 'user'}),
  new DefaultRoute({tag: 'users'}),
]);

// Mount all Riot tags.
riot.mount('*');

// Start routing
riot.router.start();

// Exports
window.store = store;
window.riot = riot;