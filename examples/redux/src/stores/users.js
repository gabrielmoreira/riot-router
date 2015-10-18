import {handleActions} from 'redux-actions';

var ids = 0;
function createId() {
    return "user-" + (ids++);
}

export var users = handleActions({

  ADD_USER: (state, {payload}) => ({
    users: [{name: payload.name, id: createId()}, ...state.users]
  }),

  REMOVE_USER_BY_ID: (state, {payload}) =>
    ({users: state.users.filter(
      (user) => (user.id !== payload.id)
    )}),

  LOAD_USERS: (state, {payload}) => (payload),

  CLEAR_USERS: () => ({users: []})

}, {users: []});