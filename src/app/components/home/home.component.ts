import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
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
export class HomeComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  isExpanded = true;
  isMobile = false;
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

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    // On mobile, always show expanded menu when opened
    if (this.isMobile) {
      this.isExpanded = true;
    }
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  onMenuItemClick() {
    // Close sidenav on mobile when a menu item is clicked
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }
}
