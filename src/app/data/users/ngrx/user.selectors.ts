import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../models/user-state.model';
import { userAdapter } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('users');
const { selectAll, selectEntities } = userAdapter.getSelectors();

export const selectAllUsers = createSelector(selectUserState, selectAll);
export const selectUserEntities = createSelector(selectUserState, selectEntities);
export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);
export const selectUserError = createSelector(selectUserState, (state) => state.error);
export const selectActiveUsers = createSelector(selectAllUsers, (users) => users.filter(u => u.isActive));
export const selectInactiveUsers = createSelector(selectAllUsers, (users) => users.filter(u => !u.isActive));
