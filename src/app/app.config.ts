import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { menuReducer } from './data/menu/ngrx/menu.reducer';
import { MenuEffects } from './data/menu/ngrx/menu.effects';
import { orderReducer } from './data/orders/ngrx/order.reducer';
import { OrderEffects } from './data/orders/ngrx/order.effects';
import { notificationReducer } from './data/notifications/ngrx/notification.reducer';
import { NotificationEffects } from './data/notifications/ngrx/notification.effects';
import { userReducer } from './data/users/ngrx/user.reducer';
import { UserEffects } from './data/users/ngrx/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      menu: menuReducer,
      orders: orderReducer,
      notifications: notificationReducer,
      users: userReducer
    }),
    provideEffects([MenuEffects, OrderEffects, NotificationEffects, UserEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
