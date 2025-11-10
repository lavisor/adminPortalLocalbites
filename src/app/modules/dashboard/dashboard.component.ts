import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';
import { MenuFacade } from '../../data/menu/ngrx/menu.facade';
import { MenuItem } from '../../data/menu/models/menu.model';
import { RESTAURANT_ID } from '../../data/data.const';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Accessing Menu Store from Dashboard Component (Cross-Module Access)
  menuItems$: Observable<MenuItem[]>;
  availableMenuItems$: Observable<MenuItem[]>;
  categories$: Observable<string[]>;
  menuLoading$: Observable<boolean>;

  constructor(private menuFacade: MenuFacade) {
    // Access menu store data from dashboard
    this.menuItems$ = this.menuFacade.getMenuList();
    this.availableMenuItems$ = this.menuFacade.availableMenuItems$;
    this.categories$ = this.menuFacade.categories$;
    this.menuLoading$ = this.menuFacade.loading$;
  }

  ngOnInit(): void {
    // Load menu items if not already loaded
    this.menuFacade.loadMenuItems(RESTAURANT_ID);
  }

  refreshMenuData(): void {
    this.menuFacade.loadMenuItems(RESTAURANT_ID, true);
  }
}
