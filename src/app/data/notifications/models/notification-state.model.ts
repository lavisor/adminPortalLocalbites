import { EntityState } from '@ngrx/entity';
import { Notification } from './notification.model';

export interface NotificationState extends EntityState<Notification> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  unreadCount: number;
  lastUpdated: number | null;
}
