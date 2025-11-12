import { MenuItem } from './menu.model';

export interface MenuState {
  menuList: MenuItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedMenuItemId: string | null;
  lastUpdated: number | null;
}
