var store = require('../stores');
var loadUsers = require('../api/users.js').loadUsers;

<users>
	<h1>Users</h1>
	<div><button onclick={loadUsers}>Load users</button> <button onclick={removeAll}>Remove all</button></div><br/>
	<div><input name="userName" placeholder="Add an user name" onkeydown={this.keydown}></div>
	<ul>
		<li each={user in this.users}>{user.name} <a href="#" onclick={this.remove} data-user={user.id}>x</a></li>
	</ul>

	keydown(e) {
		if (e.keyCode === 13) {
			store.dispatch({ type: 'ADD_USER', payload: {name: this.userName.value }});
			this.userName.value = "";
		}
		return true;
	}

	remove(e) {
		store.dispatch({ type: 'REMOVE_USER_BY_ID', payload: {id: e.target.getAttribute('data-user') }});
	}

	removeAll() {
		store.dispatch({ type: 'REMOVE_ALL_USERS'});
	}

	this.mixin('store');
	this.trackStateFromStore('users');
	this.loadUsers = loadUsers;

</users>
