import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { User } from '../models/user.model';
import { UserState } from '../models/user-state.model';

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const initialUserState: UserState = userAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  selectedUserId: null,
  lastUpdated: null
});
