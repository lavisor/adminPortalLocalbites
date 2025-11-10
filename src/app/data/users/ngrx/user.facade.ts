import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import * as UserActions from './user.actions';
import * as UserSelectors from './user.selectors';

@Injectable({
  providedIn: 'root'
})
export class UserFacade {
  users$: Observable<User[]>;
  activeUsers$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.users$ = this.store.select(UserSelectors.selectAllUsers);
    this.activeUsers$ = this.store.select(UserSelectors.selectActiveUsers);
    this.loading$ = this.store.select(UserSelectors.selectUserLoading);
    this.error$ = this.store.select(UserSelectors.selectUserError);
  }

  loadUsers(restaurantId?: string): void {
    this.store.dispatch(UserActions.loadUsers({ restaurantId }));
  }

  loadUserById(id: string): void {
    this.store.dispatch(UserActions.loadUserById({ id }));
  }

  createUser(user: CreateUserDto): void {
    this.store.dispatch(UserActions.createUser({ user }));
  }

  updateUser(id: string, updates: UpdateUserDto): void {
    this.store.dispatch(UserActions.updateUser({ id, updates }));
  }

  deleteUser(id: string): void {
    this.store.dispatch(UserActions.deleteUser({ id }));
  }

  selectUser(id: string | null): void {
    this.store.dispatch(UserActions.selectUser({ id }));
  }

  clearUserState(): void {
    this.store.dispatch(UserActions.clearUserState());
  }
}
