import {compose, applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import promise from 'redux-promise';

var logger = createLogger();
var createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore);

import {users} from './users.js';
import {routes} from './routes.js';

var reducers = combineReducers({
	users,
	routes
});

export var store = module.exports = createStoreWithMiddleware(reducers);
