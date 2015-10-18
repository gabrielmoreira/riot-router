import {handleActions} from 'redux-actions';
import uuid from 'uuid';

export var users = handleActions({

  ADD_USER: (state, {payload}) => ({
    users: [{name: payload.name, id: uuid()}, ...state.users]
  }),

  REMOVE_USER_BY_ID: (state, {payload}) =>
    ({users: state.users.filter(
      (user) => (user.id !== payload.id)
    )}),

  LOAD_USERS: (state, {payload}) => (payload),

  CLEAR_USERS: () => ({users: []})

}, {users: []});