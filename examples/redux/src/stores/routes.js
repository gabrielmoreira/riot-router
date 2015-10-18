import {handleActions} from 'redux-actions';

export var routes = handleActions({
	ROUTE_CHANGED: (state, {payload}) => (payload)
}, {});