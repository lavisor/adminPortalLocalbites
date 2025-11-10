import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import * as NotificationActions from './notification.actions';

@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      exhaustMap((action) =>
        this.notificationService.getNotifications(action.restaurantId).pipe(
          map((notifications) => NotificationActions.loadNotificationsSuccess({ notifications })),
          catchError((error) => of(NotificationActions.loadNotificationsFailure({ error: error.message })))
        )
      )
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAsRead),
      mergeMap((action) =>
        this.notificationService.markAsRead(action.id).pipe(
          map((notification) => NotificationActions.markAsReadSuccess({ notification })),
          catchError((error) => of(NotificationActions.markAsReadFailure({ error: error.message })))
        )
      )
    )
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAllAsRead),
      exhaustMap(() =>
        this.notificationService.markAllAsRead().pipe(
          map(() => NotificationActions.markAllAsReadSuccess()),
          catchError((error) => of(NotificationActions.markAllAsReadFailure({ error: error.message })))
        )
      )
    )
  );

  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.deleteNotification),
      mergeMap((action) =>
        this.notificationService.deleteNotification(action.id).pipe(
          map(() => NotificationActions.deleteNotificationSuccess({ id: action.id })),
          catchError((error) => of(NotificationActions.deleteNotificationFailure({ error: error.message })))
        )
      )
    )
  );
}
