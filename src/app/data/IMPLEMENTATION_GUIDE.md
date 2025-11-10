# NgRx Store Implementation Guide - Remaining Modules

## ✅ Completed Modules

### 1. Menu Module (COMPLETE)
- ✅ All 9 files created (models, service, actions, state, reducer, selectors, effects, facade)
- ✅ Registered in app.config.ts
- ✅ Tested and working

### 2. Orders Module (COMPLETE) 
- ✅ All 9 files created
- ✅ Registered in app.config.ts
- ✅ Ready to use

## 📋 Remaining Modules to Implement

### 3. Notifications Module (STARTED - 2/9 files)
**Status:** Models created, need 7 more files

**Completed:**
- ✅ `models/notification.model.ts`
- ✅ `models/notification-state.model.ts`

**TODO:**
- [ ] `services/notification.service.ts`
- [ ] `ngrx/notification.actions.ts`
- [ ] `ngrx/notification.state.ts`
- [ ] `ngrx/notification.reducer.ts`
- [ ] `ngrx/notification.selectors.ts`
- [ ] `ngrx/notification.effects.ts`
- [ ] `ngrx/notification.facade.ts`

### 4. Users Module (NOT STARTED)
**Status:** Need all 9 files

**Files needed:**
- [ ] `models/user.model.ts` - User interface, CreateUserDto, UpdateUserDto
- [ ] `models/user-state.model.ts` - UserState with EntityState
- [ ] `services/user.service.ts` - CRUD operations with mock data
- [ ] `ngrx/user.actions.ts` - Load, Create, Update, Delete actions
- [ ] `ngrx/user.state.ts` - EntityAdapter configuration
- [ ] `ngrx/user.reducer.ts` - State management logic
- [ ] `ngrx/user.selectors.ts` - Memoized selectors
- [ ] `ngrx/user.effects.ts` - Side effect handlers
- [ ] `ngrx/user.facade.ts` - Component API

### 5. Settings Module (NOT STARTED)
**Status:** Need all 9 files

**Note:** Settings might not need EntityState - could be a simple key-value store

**Files needed:**
- [ ] `models/settings.model.ts` - Settings interface
- [ ] `models/settings-state.model.ts` - SettingsState (not EntityState)
- [ ] `services/settings.service.ts` - Get/Update operations
- [ ] `ngrx/settings.actions.ts` - Load, Update actions
- [ ] `ngrx/settings.state.ts` - Initial state
- [ ] `ngrx/settings.reducer.ts` - State management
- [ ] `ngrx/settings.selectors.ts` - Selectors
- [ ] `ngrx/settings.effects.ts` - Side effects
- [ ] `ngrx/settings.facade.ts` - Component API

### 6. Reports Module (NOT STARTED)
**Status:** Need all 9 files

**Files needed:**
- [ ] `models/report.model.ts` - Report interface
- [ ] `models/report-state.model.ts` - ReportState with EntityState
- [ ] `services/report.service.ts` - Generate reports, mock data
- [ ] `ngrx/report.actions.ts` - Generate, Load, Delete actions
- [ ] `ngrx/report.state.ts` - EntityAdapter configuration
- [ ] `ngrx/report.reducer.ts` - State management
- [ ] `ngrx/report.selectors.ts` - Selectors
- [ ] `ngrx/report.effects.ts` - Side effects
- [ ] `ngrx/report.facade.ts` - Component API

### 7. Login/Auth Module (NOT STARTED)
**Status:** Need authentication state management

**Files needed:**
- [ ] `models/auth.model.ts` - User, LoginDto, AuthState
- [ ] `models/auth-state.model.ts` - AuthState (not EntityState)
- [ ] `services/auth.service.ts` - Login, logout, token management
- [ ] `ngrx/auth.actions.ts` - Login, Logout, CheckAuth actions
- [ ] `ngrx/auth.state.ts` - Initial auth state
- [ ] `ngrx/auth.reducer.ts` - State management
- [ ] `ngrx/auth.selectors.ts` - Auth selectors
- [ ] `ngrx/auth.effects.ts` - Login/logout effects
- [ ] `ngrx/auth.facade.ts` - Component API

---

## 🚀 Quick Implementation Template

For each module, follow this pattern (using Notifications as example):

### Step 1: Service (notification.service.ts)
```typescript
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Notification, CreateNotificationDto } from '../models/notification.model';

const MOCK_NOTIFICATIONS: Notification[] = [/* mock data */];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS];

  getNotifications(): Observable<Notification[]> {
    return of(this.notifications.filter(n => !n.isDeleted)).pipe(delay(500));
  }

  markAsRead(id: string): Observable<Notification> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      notification.readAt = new Date();
      return of(notification).pipe(delay(300));
    }
    return throwError(() => new Error('Notification not found'));
  }

  // Add other CRUD methods...
}
```

### Step 2: Actions (notification.actions.ts)
```typescript
import { createAction, props } from '@ngrx/store';
import { Notification, CreateNotificationDto } from '../models/notification.model';

export const loadNotifications = createAction('[Notification] Load Notifications');
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
// Add more actions...
```

### Step 3: State (notification.state.ts)
```typescript
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Notification } from '../models/notification.model';
import { NotificationState } from '../models/notification-state.model';

export const notificationAdapter: EntityAdapter<Notification> = 
  createEntityAdapter<Notification>({
    selectId: (notification) => notification.id,
    sortComparer: (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  });

export const initialNotificationState: NotificationState = 
  notificationAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: null,
    unreadCount: 0,
    lastUpdated: null
  });
```

### Step 4: Reducer (notification.reducer.ts)
```typescript
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
  )
  // Add more handlers...
);
```

### Step 5: Selectors (notification.selectors.ts)
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from '../models/notification-state.model';
import { notificationAdapter } from './notification.state';

export const selectNotificationState = 
  createFeatureSelector<NotificationState>('notifications');

const { selectAll } = notificationAdapter.getSelectors();

export const selectAllNotifications = createSelector(
  selectNotificationState,
  selectAll
);

export const selectUnreadCount = createSelector(
  selectNotificationState,
  (state) => state.unreadCount
);

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => !n.isRead)
);
// Add more selectors...
```

### Step 6: Effects (notification.effects.ts)
```typescript
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import * as NotificationActions from './notification.actions';

@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      exhaustMap(() =>
        this.notificationService.getNotifications().pipe(
          map((notifications) => 
            NotificationActions.loadNotificationsSuccess({ notifications })
          ),
          catchError((error) =>
            of(NotificationActions.loadNotificationsFailure({ error: error.message }))
          )
        )
      )
    )
  );
  // Add more effects...
}
```

### Step 7: Facade (notification.facade.ts)
```typescript
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import * as NotificationActions from './notification.actions';
import * as NotificationSelectors from './notification.selectors';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.notifications$ = this.store.select(
      NotificationSelectors.selectAllNotifications
    );
    this.unreadCount$ = this.store.select(
      NotificationSelectors.selectUnreadCount
    );
    this.loading$ = this.store.select(
      NotificationSelectors.selectNotificationLoading
    );
  }

  loadNotifications(): void {
    this.store.dispatch(NotificationActions.loadNotifications());
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }
  // Add more methods...
}
```

### Step 8: Register in app.config.ts
```typescript
import { notificationReducer } from './data/notifications/ngrx/notification.reducer';
import { NotificationEffects } from './data/notifications/ngrx/notification.effects';

provideStore({
  menu: menuReducer,
  orders: orderReducer,
  notifications: notificationReducer  // Add this
}),
provideEffects([MenuEffects, OrderEffects, NotificationEffects])  // Add this
```

---

## 📦 Mock Data Guidelines

### Notifications Mock Data
```typescript
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    restaurantId: 'restaurant-123',
    title: 'New Order Received',
    message: 'Order #1234 has been placed',
    type: NotificationType.ORDER_PLACED,
    priority: NotificationPriority.HIGH,
    isRead: false,
    createdAt: new Date('2025-01-10T10:00:00')
  },
  // Add 4-5 more notifications...
];
```

### Users Mock Data
```typescript
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    phone: '+1-555-0101',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  // Add 4-5 more users...
];
```

### Settings Mock Data (Not EntityState)
```typescript
interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  businessHours: {
    open: string;
    close: string;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  notifications: { email: true, push: true, sms: false },
  businessHours: { open: '09:00', close: '22:00' }
};
```

---

## 🔧 Final Steps

After implementing all modules:

1. **Update app.config.ts** with all reducers and effects
2. **Test each facade** in components
3. **Verify DevTools** shows all stores
4. **Check cross-module access** works
5. **Add error handling** for all API calls
6. **Document any custom selectors** or logic

---

## 📊 Progress Tracking

| Module | Models | Service | Actions | State | Reducer | Selectors | Effects | Facade | Registered | Status |
|--------|--------|---------|---------|-------|---------|-----------|---------|--------|------------|--------|
| Menu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | COMPLETE |
| Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | COMPLETE |
| Notifications | ✅ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |
| Users | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Settings | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Reports | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TODO |
| Login/Auth | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | TODO |

---

## 🎯 Priority Order

1. **Notifications** - Already started, easiest to complete
2. **Users** - Important for user management
3. **Login/Auth** - Critical for authentication
4. **Reports** - For analytics
5. **Settings** - For configuration

---

## 💡 Tips

1. **Copy-paste wisely**: Use Orders module as template
2. **Update names**: Change "Order" → "Notification", "order" → "notification"
3. **Adjust interfaces**: Match your domain models
4. **Mock data**: Create 3-5 realistic items per module
5. **Test incrementally**: Test each module before moving to next
6. **Use DevTools**: Verify state changes
7. **Check README.md**: Reference for patterns and best practices

---

## 📞 Need Help?

- Check `src/app/data/README.md` for detailed patterns
- Review completed modules (Menu, Orders) for examples
- Use NgRx documentation: https://ngrx.io
- Test with Redux DevTools browser extension

---

**Last Updated:** January 10, 2025
**Completed Modules:** 2/7 (Menu, Orders)
**In Progress:** Notifications
**Remaining:** Users, Settings, Reports, Login/Auth
