import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';
import { OrderFacade } from '../../../../data/orders/ngrx/order.facade';
import { Order, OrderStatus, getAllOrderStatuses, getOrderStatusColor, getOrderStatusIcon } from '../../../../data/orders/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  order: Order | null = null;
  loading = true;
  error: string | null = null;
  orderId: string | null = null;
  availableStatuses = getAllOrderStatuses();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private orderFacade: OrderFacade
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.orderId = params.get('orderId');
        if (this.orderId) {
          this.loadOrderDetails(this.orderId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrderDetails(orderId: string): void {
    this.loading = true;
    this.error = null;

    this.orderFacade.getOrderById(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          if (order) {
            this.order = order;
            this.loading = false;
          } else {
            this.orderFacade.loadOrderById(orderId);
            // Wait for the load to complete
            setTimeout(() => {
              this.orderFacade.getOrderById(orderId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(loadedOrder => {
                  if (loadedOrder) {
                    this.order = loadedOrder;
                  } else {
                    this.error = 'Order not found';
                  }
                  this.loading = false;
                });
            }, 500);
          }
        },
        error: (err) => {
          this.error = 'Failed to load order details';
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

  onStatusChange(newStatus: string): void {
    if (this.order) {
      this.orderFacade.updateOrderStatus(this.order.id, newStatus);
    }
  }

  getStatusColor(status: OrderStatus): string {
    return getOrderStatusColor(status);
  }

  getStatusIcon(status: OrderStatus): string {
    return getOrderStatusIcon(status);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  getItemTotal(item: any): number {
    return item.price ? item.price * item.quantity : 0;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  }

  printOrder(): void {
    window.print();
  }

  getMapLink(latlong?: string): string {
    if (!latlong) return '#';
    const coords = latlong.split(',');
    return `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;
  }
}
