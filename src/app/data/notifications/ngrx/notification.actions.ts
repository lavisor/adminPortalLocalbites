import { createAction, props } from '@ngrx/store';
import { Notification, CreateNotificationDto } from '../models/notification.model';

export const loadNotifications = createAction(
  '[Notification] Load Notifications',
  props<{ restaurantId?: string }>()
);

export const loadNotificationsSuccess = createAction(
  '[Notification] Load Notifications Success',
  props<{ notifications: Notification[] }>()
);

export const loadNotificationsFailure = createAction(
  '[Notification] Load Notifications Failure',
  props<{ error: string }>()
);

export const markAsRead = createAction(
  '[Notification] Mark As Read',
  props<{ id: string }>()
);

export const markAsReadSuccess = createAction(
  '[Notification] Mark As Read Success',
  props<{ notification: Notification }>()
);

export const markAsReadFailure = createAction(
  '[Notification] Mark As Read Failure',
  props<{ error: string }>()
);

export const markAllAsRead = createAction(
  '[Notification] Mark All As Read'
);

export const markAllAsReadSuccess = createAction(
  '[Notification] Mark All As Read Success'
);

export const markAllAsReadFailure = createAction(
  '[Notification] Mark All As Read Failure',
  props<{ error: string }>()
);

export const deleteNotification = createAction(
  '[Notification] Delete Notification',
  props<{ id: string }>()
);

export const deleteNotificationSuccess = createAction(
  '[Notification] Delete Notification Success',
  props<{ id: string }>()
);

export const deleteNotificationFailure = createAction(
  '[Notification] Delete Notification Failure',
  props<{ error: string }>()
);

export const clearNotifications = createAction(
  '[Notification] Clear Notifications'
);
