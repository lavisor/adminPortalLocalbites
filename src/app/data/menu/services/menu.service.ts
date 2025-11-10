import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { MenuItem } from '../models/menu.model';
import { RESTAURANT_ID, BACKEND_URL } from '../../data.const';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: MenuItem[] = [];
  private backendUrl: string = BACKEND_URL + '/menu'

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get all menu items for a restaurant
   * @param restaurantId - The restaurant ID
   * @returns Observable of menu items
   */
  getMenuItems(restaurantId: string): Observable<any> {
    return this.http.get(this.backendUrl+'/'+ restaurantId);
  }

  /**
   * Get a single menu item by ID
   * @param id - The menu item ID
   * @returns Observable of menu item
   */
  getMenuItemById(id: string): Observable<MenuItem> {
    const item = this.menuItems.find(item => item.id === id && !item.isDeleted);
    if (item) {
      return of(item).pipe(delay(300));
    }
    return throwError(() => new Error('Menu item not found'));
  }

  /**
   * Create a new menu item
   * @param menuItem - The menu item to create
   * @returns Observable of created menu item
   */
  createMenuItem(menuItem: MenuItem): Observable<MenuItem> {
    const newItem: MenuItem = {
      ...menuItem,
      itemAvailable: menuItem.itemAvailable ?? true,
      createdOn: (new Date()).toDateString(),
      isDeleted: false
    };
    this.menuItems.push(newItem);
    return of(newItem).pipe(delay(500));
  }

  /**
   * Update an existing menu item
   * @param id - The menu item ID
   * @param updates - The updates to apply
   * @returns Observable of updated menu item
   */
  updateMenuItem(id: string, updates: MenuItem): Observable<MenuItem> {
    const index = this.menuItems.findIndex(item => item.id === id && !item.isDeleted);
    if (index === -1) {
      return throwError(() => new Error('Menu item not found'));
    }

    this.menuItems[index] = {
      ...this.menuItems[index],
      ...updates,
    };

    return of(this.menuItems[index]).pipe(delay(500));
  }

  /**
   * Soft delete a menu item
   * @param id - The menu item ID
   * @returns Observable of void
   */
  deleteMenuItem(id: string): Observable<void> {
    const index = this.menuItems.findIndex(item => item.id === id);
    if (index === -1) {
      return throwError(() => new Error('Menu item not found'));
    }

    this.menuItems[index] = {
      ...this.menuItems[index],
      isDeleted: true,
    };

    return of(void 0).pipe(delay(500));
  }

  /**
   * Generate a unique ID for new menu items
   * @returns A unique ID string
   */
  private generateId(): string {
    return `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
