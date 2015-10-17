<user>
	<h1 if={this.user}>Showing user: {this.user.name}</h1>
	<h1 if={!this.user}>Loading user...</h1>

	this.mixin('store');
	this.trackStateFromStore('users');
	this.on('update', function() {
		this.user = this.users.filter(function(user) {
			return opts.id == user.id;
		})[0];
	}.bind(this));
</user>