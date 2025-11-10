import { createAction, props } from '@ngrx/store';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

export const loadUsers = createAction('[User] Load Users', props<{ restaurantId?: string }>());
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

export const loadUserById = createAction('[User] Load User By Id', props<{ id: string }>());
export const loadUserByIdSuccess = createAction('[User] Load User By Id Success', props<{ user: User }>());
export const loadUserByIdFailure = createAction('[User] Load User By Id Failure', props<{ error: string }>());

export const createUser = createAction('[User] Create User', props<{ user: CreateUserDto }>());
export const createUserSuccess = createAction('[User] Create User Success', props<{ user: User }>());
export const createUserFailure = createAction('[User] Create User Failure', props<{ error: string }>());

export const updateUser = createAction('[User] Update User', props<{ id: string; updates: UpdateUserDto }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success', props<{ id: string }>());
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());

export const selectUser = createAction('[User] Select User', props<{ id: string | null }>());
export const clearUserState = createAction('[User] Clear User State');
