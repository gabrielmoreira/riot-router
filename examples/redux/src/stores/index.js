import {users} from './users.js';
import {compose, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import promise from 'redux-promise';

var logger = createLogger();
var createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore);
var store = createStoreWithMiddleware(users);

module.exports = store;
