import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Notification, CreateNotificationDto, UpdateNotificationDto, NotificationType, NotificationPriority } from '../models/notification.model';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    restaurantId: 'restaurant-123',
    title: 'New Order Received',
    message: 'Order #1 has been placed by John Doe',
    type: NotificationType.ORDER_PLACED,
    priority: NotificationPriority.HIGH,
    isRead: false,
    createdAt: new Date('2025-01-10T10:30:00')
  },
  {
    id: '2',
    restaurantId: 'restaurant-123',
    title: 'Order Confirmed',
    message: 'Order #2 has been confirmed and is being prepared',
    type: NotificationType.ORDER_CONFIRMED,
    priority: NotificationPriority.MEDIUM,
    isRead: true,
    readAt: new Date('2025-01-10T09:15:00'),
    createdAt: new Date('2025-01-10T09:10:00')
  },
  {
    id: '3',
    restaurantId: 'restaurant-123',
    title: 'Payment Received',
    message: 'Payment of $34.97 received for Order #1',
    type: NotificationType.PAYMENT_RECEIVED,
    priority: NotificationPriority.MEDIUM,
    isRead: false,
    createdAt: new Date('2025-01-10T10:31:00')
  },
  {
    id: '4',
    title: 'System Update',
    message: 'System will be under maintenance tonight from 2 AM to 4 AM',
    type: NotificationType.SYSTEM_ALERT,
    priority: NotificationPriority.LOW,
    isRead: false,
    createdAt: new Date('2025-01-10T08:00:00')
  },
  {
    id: '5',
    restaurantId: 'restaurant-123',
    title: 'New Promotion Available',
    message: '20% off on all orders above $50 this weekend!',
    type: NotificationType.PROMOTION,
    priority: NotificationPriority.LOW,
    isRead: true,
    readAt: new Date('2025-01-09T18:00:00'),
    createdAt: new Date('2025-01-09T08:00:00')
  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS];

  getNotifications(restaurantId?: string): Observable<Notification[]> {
    const filtered = restaurantId
      ? this.notifications.filter(n => n.restaurantId === restaurantId && !n.isDeleted)
      : this.notifications.filter(n => !n.isDeleted);
    return of(filtered).pipe(delay(400));
  }

  getNotificationById(id: string): Observable<Notification> {
    const notification = this.notifications.find(n => n.id === id && !n.isDeleted);
    if (notification) {
      return of(notification).pipe(delay(200));
    }
    return throwError(() => new Error('Notification not found'));
  }

  createNotification(dto: CreateNotificationDto): Observable<Notification> {
    const newNotification: Notification = {
      id: this.generateId(),
      ...dto,
      priority: dto.priority || NotificationPriority.MEDIUM,
      isRead: false,
      createdAt: new Date(),
      isDeleted: false
    };
    this.notifications.push(newNotification);
    return of(newNotification).pipe(delay(400));
  }

  markAsRead(id: string): Observable<Notification> {
    const index = this.notifications.findIndex(n => n.id === id && !n.isDeleted);
    if (index === -1) {
      return throwError(() => new Error('Notification not found'));
    }

    this.notifications[index] = {
      ...this.notifications[index],
      isRead: true,
      readAt: new Date()
    };

    return of(this.notifications[index]).pipe(delay(300));
  }

  markAllAsRead(): Observable<void> {
    this.notifications = this.notifications.map(n => ({
      ...n,
      isRead: true,
      readAt: new Date()
    }));
    return of(void 0).pipe(delay(500));
  }

  deleteNotification(id: string): Observable<void> {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index === -1) {
      return throwError(() => new Error('Notification not found'));
    }

    this.notifications[index] = {
      ...this.notifications[index],
      isDeleted: true
    };

    return of(void 0).pipe(delay(300));
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
