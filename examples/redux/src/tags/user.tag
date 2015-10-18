import {getUserById} from '../selectors/users.js';

<user>
	<h1 if={this.user}>Showing user: {this.user.name}</h1>
	<h1 if={!this.user}>Loading user...</h1>

	this.mixin('store');
	this.trackSelector(getUserById(opts.id), 'user');
</user>