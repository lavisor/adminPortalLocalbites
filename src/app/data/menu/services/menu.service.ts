import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem } from '../models/menu.model';
import { RESTAURANT_ID, BACKEND_URL } from '../../data.const';
import { HttpClient } from '@angular/common/http';
import { transformMenuItem, transformMenuItems } from '../utils/menu.utils';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: MenuItem[] = [];
  private backendUrl: string = BACKEND_URL + '/api/menu'

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Get all menu items for a restaurant
   * @param restaurantId - The restaurant ID
   * @returns Observable of menu items
   */
  getMenuItems(restaurantId: string): Observable<MenuItem[]> {
    return this.http.get<any[]>(this.backendUrl + '/' + restaurantId +'?isAdmin=true').pipe(
      map(response => transformMenuItems(response))
    );
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
  createMenuItem(menuItem: MenuItem): Observable<any> {
    return this.http.post(this.backendUrl, menuItem);
  }

  /**
   * Update an existing menu item
   * @param id - The menu item ID
   * @param updates - The updates to apply
   * @returns Observable of updated menu item
   */
  updateMenuItem(id: string, updates: MenuItem): Observable<MenuItem> {
    return this.http.patch<any>(this.backendUrl + '/update/' + id, updates).pipe(
      map(response => transformMenuItem(response))
    );
  }

  /**
   * Soft delete a menu item
   * @param id - The menu item ID
   * @returns Observable of void
   */
  deleteMenuItem(id: string): Observable<any> {
    return this.http.delete(this.backendUrl+ '/delete/'+ id);
  }

  /**
   * Generate a unique ID for new menu items
   * @returns A unique ID string
   */
  private generateId(): string {
    return `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
