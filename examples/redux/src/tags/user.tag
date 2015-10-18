import {getUserById} from '../selectors/users.js';

<user>
	<h2 if={this.user}>Showing user: {this.user.name}</h2>
	<h2 if={!this.user}>Loading user...</h2>

	this.mixin('store');
	this.trackSelector(getUserById(opts.id), 'user');
</user>