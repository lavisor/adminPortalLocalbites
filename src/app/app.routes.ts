import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { MenuComponent } from './modules/menu/menu.component';
import { MenuEditComponent } from './modules/menu/components/menu-edit/menu-edit.component';
import { NotificationsComponent } from './modules/notifications/notifications.component';
import { OrdersComponent } from './modules/orders/orders.component';
import { OrderDetailsComponent } from './modules/orders/components/order-details/order-details.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { UsersComponent } from './modules/users/users.component';
import { UserAddressesComponent } from './modules/users/pages/user-addresses/user-addresses.component';
import { UserOrdersComponent } from './modules/users/pages/user-orders/user-orders.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'menu', 
        children: [
          { path: '', component: MenuComponent },
          { path: 'edit', component: MenuEditComponent },
          { path: 'edit/:id', component: MenuEditComponent }
        ]
      },
      { path: 'notifications', component: NotificationsComponent },
      { 
        path: 'orders', 
        children: [
          { path: '', component: OrdersComponent },
          { path: ':orderId', component: OrderDetailsComponent }
        ]
      },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { 
        path: 'users', 
        children: [
          { path: '', component: UsersComponent },
          { path: ':userId/addresses', component: UserAddressesComponent },
          { path: ':userId/orders', component: UserOrdersComponent }
        ]
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '/dashboard' } // Wildcard route for 404
];
