import riot from 'riot';
import * as store from '../stores';
import _ from 'lodash/object';

var StoreMixin = {
	getStore() {
		return store;
	},

	getState() {
		return store.getState();
	},

	onStoreUpdate(attr, fn) {
		var lastState = _.get(store.getState(), attr);
		store.subscribe(function() {
			var state = _.get(store.getState(), attr);
			if (this.storeStateChanged(lastState, state)) fn(state);
			lastState = state;
		}.bind(this));
	},

	trackStore(attr, target) {
		target = target || attr;
		this.onStoreUpdate(attr, function(state) {
			_.set(this, target, state);
			this.update();
		}.bind(this));
		_.set(this, target, _.get(store.getState(), attr));
	},

	onSelectorUpdate(selector, fn) {
		var lastState = selector(store.getState());
		store.subscribe(function () {
			var state = selector(store.getState());
			if (lastState !== state) fn(state);
			lastState = state;
		}.bind(this));
	},

	trackSelector(selector, target) {
		this.onSelectorUpdate(selector, function(state) {
			_.set(this, target, state);
			this.update();
		}.bind(this));
		_.set(this, target, selector(store.getState()));
	},

	storeStateChanged(previous, current) {
		return previous !== current;
	}
}

riot.mixin('store', StoreMixin);
