import { MenuState } from '../models/menu-state.model';

export const initialMenuState: MenuState = {
  menuList: [],
  loading: false,
  loaded: false,
  error: null,
  selectedMenuItemId: null,
  lastUpdated: null
};
