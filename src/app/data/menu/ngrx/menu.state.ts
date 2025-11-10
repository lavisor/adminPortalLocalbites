import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MenuItem } from '../models/menu.model';
import { MenuState } from '../models/menu-state.model';

export const menuAdapter: EntityAdapter<MenuItem> = createEntityAdapter<MenuItem>({
  selectId: (item: MenuItem) => item.id,
  sortComparer: false
});

export const initialMenuState: MenuState = menuAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  selectedMenuItemId: null,
  lastUpdated: null
});
