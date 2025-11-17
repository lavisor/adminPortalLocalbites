import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { User, Order } from '../../../../data/users/models/user.model';

@Component({
  selector: 'app-view-orders-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './view-orders-dialog.component.html',
  styleUrls: ['./view-orders-dialog.component.scss']
})
export class ViewOrdersDialogComponent {
  orders: Order[] = [];
  displayedColumns: string[] = ['orderNumber', 'date', 'items', 'total', 'status'];

  constructor(
    public dialogRef: MatDialogRef<ViewOrdersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    // Generate mock orders for the user
    this.orders = this.generateMockOrders(data.user.id);
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

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      pending: 'accent',
      confirmed: 'primary',
      preparing: 'accent',
      delivered: 'success',
      cancelled: 'warn'
    };
    return statusColors[status] || 'default';
  }

  getItemsSummary(items: any[]): string {
    return `${items.length} item${items.length > 1 ? 's' : ''}`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
