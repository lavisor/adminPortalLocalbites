import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { MenuFacade } from '../../data/menu/ngrx/menu.facade';
import { MenuItem } from '../../data/menu/models/menu.model';
import { RESTAURANT_ID } from '../../data/data.const';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'isAvailable', 'preparationTime'];
  
  // Observables from the store
  menuItems$: Observable<MenuItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  categories$: Observable<string[]>;

  constructor(private menuFacade: MenuFacade) {
    this.menuItems$ = this.menuFacade.getMenuList();
    this.loading$ = this.menuFacade.loading$;
    this.error$ = this.menuFacade.error$;
    this.categories$ = this.menuFacade.categories$;
  }

  ngOnInit(): void {
    // Load menu items on component initialization
    this.loadMenuItems();
  }

  /**
   * Load menu items from the store
   * @param forceRefresh - Force refresh from server
   */
  loadMenuItems(forceRefresh = false): void {
    this.menuFacade.loadMenuItems(RESTAURANT_ID, forceRefresh);
  }

  /**
   * Refresh menu items (force refresh from server)
   */
  refreshMenuItems(): void {
    this.loadMenuItems(true);
  }

  /**
   * Select a menu item
   */
  selectMenuItem(item: MenuItem): void {
    this.menuFacade.selectMenuItem(item.id);
    console.log('Selected menu item:', item);
  }
}
