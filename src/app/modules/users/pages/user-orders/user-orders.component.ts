import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';
import { User, Order } from '../../../../data/users/models/user.model';
import { UserFacade } from '../../../../data/users/ngrx/user.facade';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  user: User | null = null;
  orders: Order[] = [];
  loading = true;
  userId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userFacade: UserFacade
  ) {}

  ngOnInit(): void {
    // Get userId from route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.userId = params['userId'];
      this.loadUserAndOrders();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserAndOrders(): void {
    this.loading = true;
    
    // Get user from store
    this.userFacade.users$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.user = users.find(u => u.id === this.userId) || null;
      
      if (this.user) {
        // Generate mock orders for now
        this.orders = this.generateMockOrders(this.userId);
      }
      
      this.loading = false;
    });
  }

  private generateMockOrders(userId: string): Order[] {
    return [
      {
        id: `order-${userId}-1`,
        orderNumber: 'ORD-1001',
        date: new Date('2025-01-12'),
        total: 850.00,
        status: 'delivered',
        items: [
          { name: 'Paneer Butter Masala', quantity: 2, price: 280 },
          { name: 'Garlic Naan', quantity: 4, price: 50 },
          { name: 'Dal Makhani', quantity: 1, price: 220 }
        ]
      },
      {
        id: `order-${userId}-2`,
        orderNumber: 'ORD-1002',
        date: new Date('2025-01-10'),
        total: 450.00,
        status: 'confirmed',
        items: [
          { name: 'Veg Biryani', quantity: 1, price: 320 },
          { name: 'Raita', quantity: 1, price: 80 },
          { name: 'Gulab Jamun', quantity: 1, price: 50 }
        ]
      },
      {
        id: `order-${userId}-3`,
        orderNumber: 'ORD-1003',
        date: new Date('2025-01-08'),
        total: 1200.00,
        status: 'preparing',
        items: [
          { name: 'Chicken Tikka', quantity: 2, price: 380 },
          { name: 'Tandoori Roti', quantity: 6, price: 30 },
          { name: 'Lassi', quantity: 2, price: 80 }
        ]
      },
      {
        id: `order-${userId}-4`,
        orderNumber: 'ORD-1004',
        date: new Date('2025-01-05'),
        total: 320.00,
        status: 'cancelled',
        items: [
          { name: 'Masala Dosa', quantity: 2, price: 120 },
          { name: 'Filter Coffee', quantity: 2, price: 40 }
        ]
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getUserName(): string {
    if (!this.user) return 'User';
    
    const firstName = this.user.firstName || '';
    const lastName = this.user.lastName || '';
    const name = this.user.name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return name || 'Unknown User';
  }

  getUserPhone(): string {
    return this.user?.phone || this.user?.phoneNumber || 'N/A';
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'delivered': 'check_circle',
      'confirmed': 'schedule',
      'preparing': 'restaurant',
      'cancelled': 'cancel',
      'pending': 'hourglass_empty'
    };
    return icons[status.toLowerCase()] || 'info';
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  getItemsCount(items: any[]): string {
    return `${items.length} item${items.length !== 1 ? 's' : ''}`;
  }

  getItemsSummary(items: any[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0].name;
    if (items.length === 2) return `${items[0].name}, ${items[1].name}`;
    return `${items[0].name}, ${items[1].name}, and ${items.length - 2} more`;
  }
}
