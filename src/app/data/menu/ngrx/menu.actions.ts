import { createAction, props } from '@ngrx/store';
import { MenuItem } from '../models/menu.model';

// Load Menu Items
export const loadMenuItems = createAction(
  '[Menu] Load Menu Items',
  props<{ restaurantId: string; forceRefresh?: boolean }>()
);

export const loadMenuItemsSuccess = createAction(
  '[Menu] Load Menu Items Success',
  props<{ items: MenuItem[] }>()
);

export const loadMenuItemsFailure = createAction(
  '[Menu] Load Menu Items Failure',
  props<{ error: string }>()
);

// Load Single Menu Item
export const loadMenuItemById = createAction(
  '[Menu] Load Menu Item By Id',
  props<{ id: string }>()
);

export const loadMenuItemByIdSuccess = createAction(
  '[Menu] Load Menu Item By Id Success',
  props<{ item: MenuItem }>()
);

export const loadMenuItemByIdFailure = createAction(
  '[Menu] Load Menu Item By Id Failure',
  props<{ error: string }>()
);

// Create Menu Item
export const createMenuItem = createAction(
  '[Menu] Create Menu Item',
  props<{ menuItem: MenuItem }>()
);

export const createMenuItemSuccess = createAction(
  '[Menu] Create Menu Item Success',
  props<{ item: MenuItem }>()
);

export const createMenuItemFailure = createAction(
  '[Menu] Create Menu Item Failure',
  props<{ error: string }>()
);

// Update Menu Item
export const updateMenuItem = createAction(
  '[Menu] Update Menu Item',
  props<{ id: string; updates: MenuItem }>()
);

export const updateMenuItemSuccess = createAction(
  '[Menu] Update Menu Item Success',
  props<{ item: MenuItem }>()
);

export const updateMenuItemFailure = createAction(
  '[Menu] Update Menu Item Failure',
  props<{ error: string }>()
);

// Delete Menu Item
export const deleteMenuItem = createAction(
  '[Menu] Delete Menu Item',
  props<{ id: string }>()
);

export const deleteMenuItemSuccess = createAction(
  '[Menu] Delete Menu Item Success',
  props<{ id: string }>()
);

export const deleteMenuItemFailure = createAction(
  '[Menu] Delete Menu Item Failure',
  props<{ error: string }>()
);

// Select Menu Item
export const selectMenuItem = createAction(
  '[Menu] Select Menu Item',
  props<{ id: string | null }>()
);

// Clear Menu State
export const clearMenuState = createAction(
  '[Menu] Clear Menu State'
);
