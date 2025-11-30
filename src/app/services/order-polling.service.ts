import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { 
  interval, 
  Subject, 
  Subscription,
  BehaviorSubject,
  fromEvent
} from 'rxjs';
import { 
  switchMap, 
  takeUntil, 
  catchError,
  tap,
  filter
} from 'rxjs/operators';
import { OrderService } from '../data/orders/services/order.service';
import { Order } from '../data/orders/models/order.model';
import { ToastNotificationService } from './toast-notification.service';
import { AudioNotificationService } from './audio-notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderPollingService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private pollingSubscription: Subscription | null = null;
  private knownOrderIds = new Set<string>();
  private isInitialized = false;
  private isTabVisible = true;
  private pendingNotifications: Order[] = [];

  // Polling interval in milliseconds (20 seconds)
  private readonly POLLING_INTERVAL = 20000;
  
  // Observable to track new orders count
  private newOrdersCount$ = new BehaviorSubject<number>(0);

  constructor(
    private orderService: OrderService,
    private toastService: ToastNotificationService,
    private audioService: AudioNotificationService,
    private router: Router
  ) {
    this.setupVisibilityListener();
  }

  /**
   * Start polling for orders
   */
  startPolling(): void {
    if (this.pollingSubscription) {
      console.log('Order polling already running');
      return;
    }

    console.log('Starting order polling service...');
    
    // Initial load to populate known orders
    this.loadInitialOrders();

    // Start polling every 20 seconds
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.orderService.getOrders()),
        tap(orders => this.checkForNewOrders(orders)),
        catchError(error => {
          console.error('Error polling orders:', error);
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    console.log(`Order polling started (interval: ${this.POLLING_INTERVAL}ms)`);
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
      console.log('Order polling stopped');
    }
  }

  /**
   * Get new orders count observable
   */
  getNewOrdersCount$() {
    return this.newOrdersCount$.asObservable();
  }

  /**
   * Reset new orders count
   */
  resetNewOrdersCount(): void {
    this.newOrdersCount$.next(0);
    this.pendingNotifications = [];
  }

  /**
   * Load initial orders to populate known IDs
   */
  private loadInitialOrders(): void {
    this.orderService.getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          // Store all current order IDs
          orders.forEach(order => this.knownOrderIds.add(order.id));
          this.isInitialized = true;
          console.log(`Initialized with ${this.knownOrderIds.size} existing orders`);
        },
        error: (error) => {
          console.error('Error loading initial orders:', error);
          this.isInitialized = true; // Mark as initialized even on error
        }
      });
  }

  /**
   * Check for new orders and trigger notifications
   */
  private checkForNewOrders(orders: Order[]): void {
    if (!this.isInitialized) {
      return;
    }

    const newOrders: Order[] = [];

    // Check each order to see if it's new
    orders.forEach(order => {
      if (!this.knownOrderIds.has(order.id)) {
        newOrders.push(order);
        this.knownOrderIds.add(order.id);
      }
    });

    // If there are new orders, trigger notifications
    if (newOrders.length > 0) {
      console.log(`🔔 ${newOrders.length} new order(s) detected!`, newOrders);
      this.handleNewOrders(newOrders);
    }
  }

  /**
   * Handle new orders - show notifications and play sound
   */
  private handleNewOrders(newOrders: Order[]): void {
    // Update count
    const currentCount = this.newOrdersCount$.value;
    this.newOrdersCount$.next(currentCount + newOrders.length);

    // If tab is not visible, queue notifications
    if (!this.isTabVisible) {
      this.pendingNotifications.push(...newOrders);
      console.log('Tab not visible, notifications queued');
      return;
    }

    // Show notifications for each new order
    newOrders.forEach(order => this.showOrderNotification(order));

    // Play urgent sound (loud, 3 times)
    this.audioService.playUrgentNotification();
  }

  /**
   * Show notification for a new order
   */
  private showOrderNotification(order: Order): void {
    const message = this.formatOrderMessage(order);
    
    this.toastService.showWithAction(
      message,
      'View Order',
      () => {
        // Navigate to order details
        this.router.navigate(['/orders', order.id]);
      },
      'success',
      10000 // 10 seconds
    );
  }

  /**
   * Format order notification message
   */
  private formatOrderMessage(order: Order): string {
    const orderId = order.id.substring(0, 8);
    const amount = `₹${order.billAmount.toFixed(2)}`;
    const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let message = `🔔 New Order ${orderId}! `;
    message += `${itemCount} item${itemCount > 1 ? 's' : ''} - ${amount}`;
    
    if (order.customerName) {
      message += ` from ${order.customerName}`;
    }
    
    return message;
  }

  /**
   * Setup Page Visibility API listener
   */
  private setupVisibilityListener(): void {
    // Listen for visibility changes
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isTabVisible = !document.hidden;
        
        if (this.isTabVisible && this.pendingNotifications.length > 0) {
          console.log(`Tab visible again, showing ${this.pendingNotifications.length} pending notifications`);
          
          // Show all pending notifications
          this.pendingNotifications.forEach(order => {
            this.showOrderNotification(order);
          });
          
          // Play sound once for all pending notifications
          this.audioService.playUrgentNotification();
          
          // Clear pending notifications
          this.pendingNotifications = [];
        }
      });
  }

  /**
   * Preload audio on first user interaction
   */
  async preloadAudio(): Promise<void> {
    try {
      await this.audioService.preload();
      console.log('Audio preloaded successfully');
    } catch (error) {
      console.warn('Audio preload failed:', error);
    }
  }

  /**
   * Test notification (for debugging)
   */
  async testNotification(): Promise<void> {
    console.log('Testing notification system...');
    
    const testOrder: Order = {
      id: 'TEST123456',
      userId: 'test-user',
      restaurantId: 'test-restaurant',
      orderItems: [
        {
          menuId: 'test-menu',
          name: 'Test Item',
          quantity: 2,
          price: 100
        }
      ],
      deliveryStatus: 'Pending' as any,
      billAmount: 200,
      paymentMode: 'COD',
      isPaymentSuccess: false,
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      customerName: 'Test Customer',
      customerPhone: '1234567890'
    };

    this.showOrderNotification(testOrder);
    await this.audioService.playUrgentNotification();
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
