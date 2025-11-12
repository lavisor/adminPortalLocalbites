import { MenuItem } from '../models/menu.model';

/**
 * Transform a single menu item from backend format to frontend format
 * Maps _id to id and removes _id property
 * @param item - Raw item from backend with _id
 * @returns Transformed MenuItem with id
 */
export function transformMenuItem(item: any): MenuItem {
  const { _id, ...rest } = item;
  return {
    ...rest,
    id: _id || item.id  // Use _id if present, fallback to id
  } as MenuItem;
}

/**
 * Transform an array of menu items from backend format to frontend format
 * @param items - Raw items from backend with _id
 * @returns Array of transformed MenuItems with id
 */
export function transformMenuItems(items: any[]): MenuItem[] {
  return items.map(transformMenuItem);
}
