import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Notification } from '../models/notification.model';
import { NotificationState } from '../models/notification-state.model';

export const notificationAdapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
  selectId: (notification: Notification) => notification.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
});

export const initialNotificationState: NotificationState = notificationAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  unreadCount: 0,
  lastUpdated: null
});
