import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'menu', 
        children: [
          { 
            path: '', 
            loadComponent: () => import('./modules/menu/menu.component').then(m => m.MenuComponent)
          },
          { 
            path: 'edit', 
            loadComponent: () => import('./modules/menu/components/menu-edit/menu-edit.component').then(m => m.MenuEditComponent)
          },
          { 
            path: 'edit/:id', 
            loadComponent: () => import('./modules/menu/components/menu-edit/menu-edit.component').then(m => m.MenuEditComponent)
          }
        ]
      },
      { 
        path: 'notifications', 
        loadComponent: () => import('./modules/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      { 
        path: 'orders', 
        children: [
          { 
            path: '', 
            loadComponent: () => import('./modules/orders/orders.component').then(m => m.OrdersComponent)
          },
          { 
            path: ':orderId', 
            loadComponent: () => import('./modules/orders/components/order-details/order-details.component').then(m => m.OrderDetailsComponent)
          }
        ]
      },
      { 
        path: 'reports', 
        loadComponent: () => import('./modules/reports/reports.component').then(m => m.ReportsComponent)
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent)
      },
      { 
        path: 'users', 
        children: [
          { 
            path: '', 
            loadComponent: () => import('./modules/users/users.component').then(m => m.UsersComponent)
          },
          { 
            path: ':userId/addresses', 
            loadComponent: () => import('./modules/users/pages/user-addresses/user-addresses.component').then(m => m.UserAddressesComponent)
          },
          { 
            path: ':userId/orders', 
            loadComponent: () => import('./modules/users/pages/user-orders/user-orders.component').then(m => m.UserOrdersComponent)
          }
        ]
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
