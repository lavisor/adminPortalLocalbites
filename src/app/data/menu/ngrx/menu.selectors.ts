import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MenuState } from '../models/menu-state.model';
import { menuAdapter } from './menu.state';

// Feature selector
export const selectMenuState = createFeatureSelector<MenuState>('menu');

// Entity selectors
const { selectAll, selectEntities, selectIds, selectTotal } = menuAdapter.getSelectors();

// Select all menu items
export const selectAllMenuItems = createSelector(
  selectMenuState,
  selectAll
);

// Select menu items as entities (dictionary)
export const selectMenuEntities = createSelector(
  selectMenuState,
  selectEntities
);

// Select menu item IDs
export const selectMenuIds = createSelector(
  selectMenuState,
  selectIds
);

// Select total count of menu items
export const selectMenuTotal = createSelector(
  selectMenuState,
  selectTotal
);

// Select loading state
export const selectMenuLoading = createSelector(
  selectMenuState,
  (state) => state.loading
);

// Select loaded state
export const selectMenuLoaded = createSelector(
  selectMenuState,
  (state) => state.loaded
);

// Select error state
export const selectMenuError = createSelector(
  selectMenuState,
  (state) => state.error
);

// Select last updated timestamp
export const selectMenuLastUpdated = createSelector(
  selectMenuState,
  (state) => state.lastUpdated
);

// Select selected menu item ID
export const selectSelectedMenuItemId = createSelector(
  selectMenuState,
  (state) => state.selectedMenuItemId
);

// Select the currently selected menu item
export const selectSelectedMenuItem = createSelector(
  selectMenuEntities,
  selectSelectedMenuItemId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Select menu items by category
export const selectMenuItemsByCategory = (category: string) =>
  createSelector(selectAllMenuItems, (items) =>
    items.filter((item) => item.classification === category)
  );

// Select available menu items
export const selectAvailableMenuItems = createSelector(
  selectAllMenuItems,
  (items) => items.filter((item) => item.itemAvailable)
);

// Select unavailable menu items
export const selectUnavailableMenuItems = createSelector(
  selectAllMenuItems,
  (items) => items.filter((item) => !item.itemAvailable)
);

// Select menu items by price range
export const selectMenuItemsByPriceRange = (minPrice: number, maxPrice: number) =>
  createSelector(selectAllMenuItems, (items) =>
    items.filter((item) => item.price >= minPrice && item.price <= maxPrice)
  );

// Select unique categories
export const selectMenuCategories = createSelector(
  selectAllMenuItems,
  (items) => {
    const categories = items.map((item) => item.classification);
    return Array.from(new Set(categories)).sort();
  }
);

// Select menu item by ID
export const selectMenuItemById = (id: string) =>
  createSelector(selectMenuEntities, (entities) => entities[id] || null);
