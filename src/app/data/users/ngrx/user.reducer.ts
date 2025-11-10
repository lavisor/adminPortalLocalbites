import { createReducer, on } from '@ngrx/store';
import { userAdapter, initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users }) =>
    userAdapter.setAll(users, { ...state, loading: false, loaded: true, lastUpdated: Date.now() })
  ),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(UserActions.loadUserByIdSuccess, (state, { user }) =>
    userAdapter.upsertOne(user, { ...state, loading: false })
  ),
  on(UserActions.createUserSuccess, (state, { user }) =>
    userAdapter.addOne(user, { ...state, loading: false, lastUpdated: Date.now() })
  ),
  on(UserActions.updateUserSuccess, (state, { user }) =>
    userAdapter.updateOne({ id: user.id, changes: user }, { ...state, loading: false, lastUpdated: Date.now() })
  ),
  on(UserActions.deleteUserSuccess, (state, { id }) =>
    userAdapter.removeOne(id, { ...state, loading: false, lastUpdated: Date.now() })
  ),
  on(UserActions.selectUser, (state, { id }) => ({ ...state, selectedUserId: id })),
  on(UserActions.clearUserState, () => initialUserState)
);
