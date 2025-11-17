import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      exhaustMap((action) =>
        this.userService.getUsers(action.restaurantId).pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserById),
      mergeMap((action) =>
        this.userService.getUserById(action.id).pipe(
          map((user) => UserActions.loadUserByIdSuccess({ user })),
          catchError((error) => of(UserActions.loadUserByIdFailure({ error: error.message })))
        )
      )
    )
  );

  // Note: Create, update, and delete effects are commented out as these operations
  // are not yet implemented in the API integration. Uncomment when backend endpoints are ready.
  
  // createUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.createUser),
  //     mergeMap((action) =>
  //       this.userService.createUser(action.user).pipe(
  //         map((user) => UserActions.createUserSuccess({ user })),
  //         catchError((error) => of(UserActions.createUserFailure({ error: error.message })))
  //       )
  //     )
  //   )
  // );

  // updateUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.updateUser),
  //     mergeMap((action) =>
  //       this.userService.updateUser(action.id, action.updates).pipe(
  //         map((user) => UserActions.updateUserSuccess({ user })),
  //         catchError((error) => of(UserActions.updateUserFailure({ error: error.message })))
  //       )
  //     )
  //   )
  // );

  // deleteUser$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(UserActions.deleteUser),
  //     mergeMap((action) =>
  //       this.userService.deleteUser(action.id).pipe(
  //         map(() => UserActions.deleteUserSuccess({ id: action.id })),
  //         catchError((error) => of(UserActions.deleteUserFailure({ error: error.message })))
  //       )
  //     )
  //   )
  // );
}
