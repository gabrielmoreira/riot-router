import * as userActions from '../actions/users.js';

userActions.loadUsers();

<users>
	<h2>Users</h2>
	<div>
		<button onclick={userActions.loadUsers}>Load users</button>
		<button onclick={clear}>Clear</button>
	</div>
	<br/>
	<div><input name="userName" placeholder="Add an user name" onkeydown={this.keydown}></div>
	<ul>
		<li each={user in this.users}>
			<a href="#/user/{user.id}">{user.name}</a>&nbsp;
			<a href="#" onclick={this.remove} data-user={user.id}>remove</a>
		</li>
	</ul>

	keydown(e) {
		if (e.keyCode === 13) {
			userActions.addUser({name: this.userName.value});
			this.userName.value = "";
		}
		return true;
	}

	remove(e) {
		userActions.removeUserById(e.target.getAttribute('data-user'));
	}

	clear() {
		userActions.clearUsers();
	}

	this.mixin('store');
	this.trackStore('users');
	this.userActions = userActions;
</users>
