import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';
import { OrderFacade } from '../../data/orders/ngrx/order.facade';
import { Order, OrderStatus, getAllOrderStatuses, getOrderStatusColor, getOrderStatusIcon } from '../../data/orders/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  orders$;
  loading$;
  error$;
  ongoingCount$;
  historyCount$;
  
  searchTerm = '';
  selectedTab = 0;
  availableStatuses = getAllOrderStatuses();
  
  constructor(
    private orderFacade: OrderFacade,
    private router: Router
  ) {
    this.orders$ = this.orderFacade.filteredOrders$;
    this.loading$ = this.orderFacade.loading$;
    this.error$ = this.orderFacade.error$;
    this.ongoingCount$ = this.orderFacade.ongoingOrdersCount$;
    this.historyCount$ = this.orderFacade.historyOrdersCount$;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.orderFacade.loadOrders();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    const tab = index === 0 ? 'ongoing' : 'history';
    this.orderFacade.setTab(tab);
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.orderFacade.filterBySearch(searchTerm);
  }

  onStatusChange(orderId: string, newStatus: string): void {
    this.orderFacade.updateOrderStatus(orderId, newStatus);
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  refreshOrders(): void {
    this.orderFacade.refreshOrders();
  }

  getStatusColor(status: OrderStatus): string {
    return getOrderStatusColor(status);
  }

  getStatusIcon(status: OrderStatus): string {
    return getOrderStatusIcon(status);
  }

  getItemsDisplay(order: Order): string {
    const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemCount = order.orderItems.length;
    
    if (itemCount === 1) {
      return `${order.orderItems[0].name} (${totalItems})`;
    } else {
      return `${itemCount} items (${totalItems} total)`;
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const orderDate = new Date(date);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return orderDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: orderDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  getCustomerInfo(order: Order): string {
    if (order.customerName) {
      return order.customerName;
    }
    return 'Customer';
  }

  getCustomerPhone(order: Order): string {
    return order.customerPhone || 'No phone available';
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
