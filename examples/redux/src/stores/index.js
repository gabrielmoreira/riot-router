import {compose, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import promise from 'redux-promise';

var logger = createLogger();
var createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore);

import {users} from './users.js';
var store = module.exports = createStoreWithMiddleware(users);
