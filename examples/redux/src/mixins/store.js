import riot from 'riot';
import * as store from '../stores';

var StoreMixin = {
	getStore() {
		return store.getState();
	},

	onStoreUpdate(attr, fn) {
		var lastState = store.getState()[attr];
		store.subscribe(function() {
			var state = store.getState()[attr];
			if (lastState !== state) fn(state);
			lastState = state;
		});
	},

	trackStateFromStore(attr) {
		this.onStoreUpdate(attr, function(state) {
			this[attr] = state;
			this.update();
		}.bind(this));
		this[attr] = store.getState()[attr];
	}
}

riot.mixin('store', StoreMixin);
