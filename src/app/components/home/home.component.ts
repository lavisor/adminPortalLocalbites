import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isExpanded = true;
  hotelName = 'LocalBites Admin';

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/orders', icon: 'receipt_long', label: 'Orders' },
    { path: '/menu', icon: 'restaurant_menu', label: 'Menu' },
    { path: '/users', icon: 'people', label: 'Users' },
    { path: '/reports', icon: 'assessment', label: 'Reports' },
    { path: '/notifications', icon: 'notifications', label: 'Notifications' },
    { path: '/settings', icon: 'settings', label: 'Settings' }
  ];

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }
}
