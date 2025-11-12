import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { MenuFacade } from '../../data/menu/ngrx/menu.facade';
import { MenuItem } from '../../data/menu/models/menu.model';
import { RESTAURANT_ID } from '../../data/data.const';
import { MenuItemDialogComponent } from './components/menu-item-dialog/menu-item-dialog.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  // Observables from the store
  menuItems$: Observable<MenuItem[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  categories$: Observable<string[]>;

  constructor(
    private menuFacade: MenuFacade,
    private dialog: MatDialog
  ) {
    this.menuItems$ = this.menuFacade.getMenuList();
    this.loading$ = this.menuFacade.loading$;
    this.error$ = this.menuFacade.error$;
    this.categories$ = this.menuFacade.categories$;
  }

  ngOnInit(): void {
    // Load menu items on component initialization
    this.loadMenuItems();
    this.menuItems$.subscribe((data) => {
      console.log(data);
    })
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


  addMenuItem(): void {
    this.editMenuItem(null);
  }

  /**
   * Open edit dialog for a menu item
   */
  editMenuItem(item: any): void {
    const dialogRef = this.dialog.open(MenuItemDialogComponent, {
      width: '600px',
      data: { item },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'save') {
        const updatedItem: MenuItem = {
          ...item,
          ...result.data
        };
        this.menuFacade.updateMenuItem(item.id, updatedItem);
      }

      if(result && result.action === 'add'){
        const updatedItem: MenuItem = {
          ...item,
          ...result.data,
          restaurantId: RESTAURANT_ID,
        };
        this.menuFacade.createMenuItem(updatedItem);
      }
    });
  }

  /**
   * Delete a menu item with confirmation
   */
  deleteMenuItem(item: MenuItem): void {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.menuFacade.deleteMenuItem(item.id);
    }
  }

  /**
   * Get placeholder image
   */
  getImageUrl(item: MenuItem): string {
    return item.imageUrl || 'https://www.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781';
  }
}
