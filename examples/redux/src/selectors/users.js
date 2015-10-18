import {createSelector} from 'reselect';

export const getUsers = state => (state.users);

export const getUserById = id => {
	return createSelector(getUsers,
		(users) => (users.filter((user) => (id == user.id))[0]));
}
