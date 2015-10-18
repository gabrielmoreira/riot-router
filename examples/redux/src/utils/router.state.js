import riot from 'riot';
import router from 'riot-router/lib/router.js';
import * as store from '../stores';

var fromRouter = false;
var fromStore = false;

riot.router.on('route:updated', function() {
	fromRouter = true;
	if (!fromStore) store.dispatch({type: 'ROUTE_CHANGED', payload: {uri: riot.router.current.uri}});
	fromRouter = false;
});

store.subscribe(() => {
	var state = store.getState();
	if (!fromRouter && state.routes && state.routes.uri !== riot.router.current.uri) {
		fromStore = true;
		riot.route(state.routes.uri);
		fromStore = false;
	}
});
