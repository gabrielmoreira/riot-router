import * as store from '../stores';

export function loadUsers() {
  var users = fetch('http://api.randomuser.me/?seed=riot-router&results=30')
    .then((response) => (response.json()))
    .then(function({results}) {
      return results.map(function({user}) {
        return {
          id: user.md5,
          name: user.name.first + " " + user.name.last
        };
      })
    }).then((users) => {
      return {users: users};
    });
  store.dispatch({type: 'LOAD_USERS', payload: users});
  return users;
}
