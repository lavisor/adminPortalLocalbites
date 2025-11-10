import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from '../models/notification-state.model';
import { notificationAdapter } from './notification.state';

export const selectNotificationState = createFeatureSelector<NotificationState>('notifications');

const { selectAll, selectEntities, selectTotal } = notificationAdapter.getSelectors();

export const selectAllNotifications = createSelector(selectNotificationState, selectAll);

export const selectNotificationEntities = createSelector(selectNotificationState, selectEntities);

export const selectNotificationTotal = createSelector(selectNotificationState, selectTotal);

export const selectNotificationLoading = createSelector(selectNotificationState, (state) => state.loading);

export const selectNotificationError = createSelector(selectNotificationState, (state) => state.error);

export const selectUnreadCount = createSelector(selectNotificationState, (state) => state.unreadCount);

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => !n.isRead)
);

export const selectReadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => n.isRead)
);
