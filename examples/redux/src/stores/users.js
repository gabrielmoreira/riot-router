import {handleActions} from 'redux-actions';
import uuid from 'uuid';

export var users = handleActions({

  ADD_USER: (state, {payload}) => (
    [{name: payload.name, id: uuid()}, ...state]
  ),

  REMOVE_USER_BY_ID: (state, {payload}) =>
    (state.filter(
      (user) => (user.id !== payload.id)
    )),

  LOAD_USERS: (state, {payload}) => (payload),

  CLEAR_USERS: () => ([])

}, []);