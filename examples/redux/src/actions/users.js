import * as store from '../stores';

export function loadUsers() {
  store.dispatch({type: 'LOAD_USERS_REQUEST'});
  var users = fetch('http://api.randomuser.me/?seed=riot-router&results=30')
    .then((response) => (response.json()))
    .then(function({results}) {
      return results.map(function({user}) {
        return {
          id: user.md5,
          name: user.name.first + " " + user.name.last
        };
      })
    });
  store.dispatch({type: 'LOAD_USERS', payload: users});
  return users;
}

export function removeUserById(id) {
  store.dispatch({ type: 'REMOVE_USER_BY_ID', payload: {id: id}});
}

export function clearUsers() {
  store.dispatch({ type: 'CLEAR_USERS'});
}

export function addUser(user) {
  store.dispatch({ type: 'ADD_USER', payload: user});
}