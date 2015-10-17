import * as stores from '../stores';
import {loadUsers} from '../api/users.js';

loadUsers();

<users>
	<h1>Users</h1>
	<div><button onclick={loadUsers}>Load users</button> <button onclick={clear}>Clear</button></div><br/>
	<div><input name="userName" placeholder="Add an user name" onkeydown={this.keydown}></div>
	<ul>
		<li each={user in this.users}><a href="#/user/{user.id}">{user.name}</a>&nbsp;<a href="#" onclick={this.remove} data-user={user.id}>x</a></li>
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

	clear() {
		store.dispatch({ type: 'CLEAR_USERS'});
	}

	this.mixin('store');
	this.trackStateFromStore('users');
	this.loadUsers = loadUsers;

</users>
