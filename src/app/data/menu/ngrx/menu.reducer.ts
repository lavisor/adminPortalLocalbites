import { createReducer, on } from '@ngrx/store';
import { menuAdapter, initialMenuState } from './menu.state';
import * as MenuActions from './menu.actions';

export const menuReducer = createReducer(
  initialMenuState,

  // Load Menu Items
  on(MenuActions.loadMenuItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.loadMenuItemsSuccess, (state, { items }) =>
    menuAdapter.setAll(items, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      lastUpdated: Date.now()
    })
  ),

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

  on(MenuActions.loadMenuItemByIdSuccess, (state, { item }) =>
    menuAdapter.upsertOne(item, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(MenuActions.loadMenuItemByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Menu Item (Optimistic Update)
  on(MenuActions.createMenuItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.createMenuItemSuccess, (state, { item }) =>
    menuAdapter.addOne(item, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: Date.now()
    })
  ),

  on(MenuActions.createMenuItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Menu Item (Optimistic Update)
  on(MenuActions.updateMenuItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(MenuActions.updateMenuItemSuccess, (state, { item }) =>
    menuAdapter.updateOne(
      { id: item.id, changes: item },
      {
        ...state,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      }
    )
  ),

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

  on(MenuActions.deleteMenuItemSuccess, (state, { id }) =>
    menuAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
      selectedMenuItemId: state.selectedMenuItemId === id ? null : state.selectedMenuItemId,
      lastUpdated: Date.now()
    })
  ),

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
