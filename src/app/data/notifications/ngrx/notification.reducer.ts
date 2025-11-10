import { createReducer, on } from '@ngrx/store';
import { notificationAdapter, initialNotificationState } from './notification.state';
import * as NotificationActions from './notification.actions';

export const notificationReducer = createReducer(
  initialNotificationState,

  on(NotificationActions.loadNotifications, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(NotificationActions.loadNotificationsSuccess, (state, { notifications }) =>
    notificationAdapter.setAll(notifications, {
      ...state,
      loading: false,
      loaded: true,
      unreadCount: notifications.filter(n => !n.isRead).length,
      lastUpdated: Date.now()
    })
  ),

  on(NotificationActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(NotificationActions.markAsReadSuccess, (state, { notification }) =>
    notificationAdapter.updateOne(
      { id: notification.id, changes: notification },
      {
        ...state,
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
    )
  ),

  on(NotificationActions.markAllAsReadSuccess, (state) =>
    notificationAdapter.map(
      n => ({ ...n, isRead: true, readAt: new Date() }),
      { ...state, unreadCount: 0 }
    )
  ),

  on(NotificationActions.deleteNotificationSuccess, (state, { id }) =>
    notificationAdapter.removeOne(id, state)
  ),

  on(NotificationActions.clearNotifications, () => initialNotificationState)
);
