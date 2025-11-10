import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import * as NotificationActions from './notification.actions';
import * as NotificationSelectors from './notification.selectors';

@Injectable({
  providedIn: 'root'
})
export class NotificationFacade {
  notifications$: Observable<Notification[]>;
  unreadNotifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.notifications$ = this.store.select(NotificationSelectors.selectAllNotifications);
    this.unreadNotifications$ = this.store.select(NotificationSelectors.selectUnreadNotifications);
    this.unreadCount$ = this.store.select(NotificationSelectors.selectUnreadCount);
    this.loading$ = this.store.select(NotificationSelectors.selectNotificationLoading);
    this.error$ = this.store.select(NotificationSelectors.selectNotificationError);
  }

  loadNotifications(restaurantId?: string): void {
    this.store.dispatch(NotificationActions.loadNotifications({ restaurantId }));
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationActions.markAllAsRead());
  }

  deleteNotification(id: string): void {
    this.store.dispatch(NotificationActions.deleteNotification({ id }));
  }

  clearNotifications(): void {
    this.store.dispatch(NotificationActions.clearNotifications());
  }
}
