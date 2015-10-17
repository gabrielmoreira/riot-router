import {handleActions} from 'redux-actions';

var ids = 0;
function createId() {
    return "user-" + (ids++);
}

export var users = handleActions({

  ADD_USER: (state, action) => ({
    users: [...state.users, {name: action.payload.name, id: createId()}]
  }),

  REMOVE_USER_BY_ID: (state, action) => ({users: state.users.filter(function(user) {
    return user.id !== action.payload.id;
  })}),

  LOAD_USERS: (state, {payload}) => (payload),

  REMOVE_ALL_USERS: () => ({users: []})

}, {users: []});