import { createReducer, on } from '@ngrx/store';
import { initialMenuState } from './menu.state';
import * as MenuActions from './menu.actions';

export const menuReducer = createReducer(
  initialMenuState,

  // Load Menu Items
  on(MenuActions.loadMenuItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.loadMenuItemsSuccess, (state, { items }) => ({
    ...state,
    menuList: items,
    loading: false,
    loaded: true,
    error: null,
    lastUpdated: Date.now()
  })),

  on(MenuActions.loadMenuItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  })),

  // Load Single Menu Item
  on(MenuActions.loadMenuItemById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.loadMenuItemByIdSuccess, (state, { item }) => {
    const existingIndex = state.menuList.findIndex(i => i.id === item.id);
    const updatedList = existingIndex >= 0
      ? state.menuList.map(i => i.id === item.id ? item : i)
      : [...state.menuList, item];
    
    return {
      ...state,
      menuList: updatedList,
      loading: false,
      error: null
    };
  }),

  on(MenuActions.loadMenuItemByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Menu Item
  on(MenuActions.createMenuItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.createMenuItemSuccess, (state, { item }) => ({
    ...state,
    menuList: [...state.menuList, item],
    loading: false,
    error: null,
    lastUpdated: Date.now()
  })),

  on(MenuActions.createMenuItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Menu Item
  on(MenuActions.updateMenuItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.updateMenuItemSuccess, (state, { item }) => ({
    ...state,
    menuList: state.menuList.map(i => i.id === item.id ? item : i),
    loading: false,
    error: null,
    lastUpdated: Date.now()
  })),

  on(MenuActions.updateMenuItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Menu Item
  on(MenuActions.deleteMenuItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.deleteMenuItemSuccess, (state, { id }) => ({
    ...state,
    menuList: state.menuList.filter(item => item.id !== id),
    loading: false,
    error: null,
    selectedMenuItemId: state.selectedMenuItemId === id ? null : state.selectedMenuItemId,
    lastUpdated: Date.now()
  })),

  on(MenuActions.deleteMenuItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Select Menu Item
  on(MenuActions.selectMenuItem, (state, { id }) => ({
    ...state,
    selectedMenuItemId: id
  })),

  // Clear Menu State
  on(MenuActions.clearMenuState, () => initialMenuState)
);
