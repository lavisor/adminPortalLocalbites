import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MenuItem, CreateMenuDto, UpdateMenuDto } from '../models/menu.model';
import * as MenuActions from './menu.actions';
import * as MenuSelectors from './menu.selectors';

@Injectable({
  providedIn: 'root'
})
export class MenuFacade {
  // Observables for component consumption
  menuItems$: Observable<MenuItem[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedMenuItem$: Observable<MenuItem | null | undefined>;
  availableMenuItems$: Observable<MenuItem[]>;
  categories$: Observable<string[]>;
  lastUpdated$: Observable<number | null>;

  constructor(private store: Store) {
    this.menuItems$ = this.store.select(MenuSelectors.selectAllMenuItems);
    this.loading$ = this.store.select(MenuSelectors.selectMenuLoading);
    this.loaded$ = this.store.select(MenuSelectors.selectMenuLoaded);
    this.error$ = this.store.select(MenuSelectors.selectMenuError);
    this.selectedMenuItem$ = this.store.select(MenuSelectors.selectSelectedMenuItem);
    this.availableMenuItems$ = this.store.select(MenuSelectors.selectAvailableMenuItems);
    this.categories$ = this.store.select(MenuSelectors.selectMenuCategories);
    this.lastUpdated$ = this.store.select(MenuSelectors.selectMenuLastUpdated);
  }

  /**
   * Load menu items for a restaurant
   * @param restaurantId - The restaurant ID
   * @param forceRefresh - Force refresh from server (bypass cache)
   */
  loadMenuItems(restaurantId: string, forceRefresh = false): void {
    this.store.dispatch(MenuActions.loadMenuItems({ restaurantId, forceRefresh }));
  }

  /**
   * Load a single menu item by ID
   * @param id - The menu item ID
   */
  loadMenuItemById(id: string): void {
    this.store.dispatch(MenuActions.loadMenuItemById({ id }));
  }

  /**
   * Create a new menu item
   * @param menuItem - The menu item to create
   */
  createMenuItem(menuItem: MenuItem): void {
    this.store.dispatch(MenuActions.createMenuItem({ menuItem }));
  }

  /**
   * Update an existing menu item
   * @param id - The menu item ID
   * @param updates - The updates to apply
   */
  updateMenuItem(id: string, updates: MenuItem): void {
    this.store.dispatch(MenuActions.updateMenuItem({ id, updates }));
  }

  /**
   * Delete a menu item
   * @param id - The menu item ID
   */
  deleteMenuItem(id: string): void {
    this.store.dispatch(MenuActions.deleteMenuItem({ id }));
  }

  /**
   * Select a menu item (set as current selection)
   * @param id - The menu item ID (null to deselect)
   */
  selectMenuItem(id: string | null): void {
    this.store.dispatch(MenuActions.selectMenuItem({ id }));
  }

  /**
   * Get menu items by category
   * @param category - The category name
   * @returns Observable of filtered menu items
   */
  getMenuItemsByCategory(category: string): Observable<MenuItem[]> {
    return this.store.select(MenuSelectors.selectMenuItemsByCategory(category));
  }

  /**
   * Get menu items by price range
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @returns Observable of filtered menu items
   */
  getMenuItemsByPriceRange(minPrice: number, maxPrice: number): Observable<MenuItem[]> {
    return this.store.select(MenuSelectors.selectMenuItemsByPriceRange(minPrice, maxPrice));
  }

  /**
   * Get a specific menu item by ID
   * @param id - The menu item ID
   * @returns Observable of the menu item or null
   */
  getMenuItemById(id: string): Observable<MenuItem | null | undefined> {
    return this.store.select(MenuSelectors.selectMenuItemById(id));
  }

  /**
   * Clear the menu state
   */
  clearMenuState(): void {
    this.store.dispatch(MenuActions.clearMenuState());
  }

  /**
   * Get the full menu list (alias for menuItems$)
   * @returns Observable of all menu items
   */
  getMenuList(): Observable<MenuItem[]> {
    return this.menuItems$;
  }
}
