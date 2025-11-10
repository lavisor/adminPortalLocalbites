import { EntityState } from '@ngrx/entity';
import { User } from './user.model';

export interface UserState extends EntityState<User> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedUserId: string | null;
  lastUpdated: number | null;
}
