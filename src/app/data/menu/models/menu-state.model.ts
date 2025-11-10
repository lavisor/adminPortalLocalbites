import { EntityState } from '@ngrx/entity';
import { MenuItem } from './menu.model';

export interface MenuState extends EntityState<MenuItem> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedMenuItemId: string | null;
  lastUpdated: number | null;
}
