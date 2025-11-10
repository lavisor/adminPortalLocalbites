import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderDto, OrderStatus, PaymentStatus } from '../models/order.model';

// Mock data
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    restaurantId: 'restaurant-123',
    userId: 'user-1',
    userName: 'John Doe',
    userPhone: '+1-555-0101',
    items: [
      { menuItemId: '1', menuItemName: 'Margherita Pizza', quantity: 2, price: 12.99, subtotal: 25.98 },
      { menuItemId: '2', menuItemName: 'Caesar Salad', quantity: 1, price: 8.99, subtotal: 8.99 }
    ],
    totalAmount: 34.97,
    status: OrderStatus.PREPARING,
    paymentStatus: PaymentStatus.PAID,
    deliveryAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    orderDate: new Date('2025-01-10T10:30:00'),
    deliveryTime: new Date('2025-01-10T11:30:00'),
    createdAt: new Date('2025-01-10T10:30:00'),
    updatedAt: new Date('2025-01-10T10:45:00')
  },
  {
    id: '2',
    restaurantId: 'restaurant-123',
    userId: 'user-2',
    userName: 'Jane Smith',
    userPhone: '+1-555-0102',
    items: [
      { menuItemId: '4', menuItemName: 'Spaghetti Carbonara', quantity: 1, price: 14.99, subtotal: 14.99 }
    ],
    totalAmount: 14.99,
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    deliveryAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    orderDate: new Date('2025-01-10T09:00:00'),
    deliveryTime: new Date('2025-01-10T10:00:00'),
    createdAt: new Date('2025-01-10T09:00:00'),
    updatedAt: new Date('2025-01-10T10:00:00')
  },
  {
    id: '3',
    restaurantId: 'restaurant-123',
    userId: 'user-3',
    userName: 'Bob Johnson',
    userPhone: '+1-555-0103',
    items: [
      { menuItemId: '3', menuItemName: 'Grilled Chicken Sandwich', quantity: 3, price: 10.99, subtotal: 32.97 }
    ],
    totalAmount: 32.97,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    deliveryAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    orderDate: new Date('2025-01-10T11:00:00'),
    createdAt: new Date('2025-01-10T11:00:00'),
    updatedAt: new Date('2025-01-10T11:00:00')
  }
];

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [...MOCK_ORDERS];

  getOrders(restaurantId?: string): Observable<Order[]> {
    const filtered = restaurantId 
      ? this.orders.filter(o => o.restaurantId === restaurantId && !o.isDeleted)
      : this.orders.filter(o => !o.isDeleted);
    return of(filtered).pipe(delay(500));
  }

  getOrderById(id: string): Observable<Order> {
    const order = this.orders.find(o => o.id === id && !o.isDeleted);
    if (order) {
      return of(order).pipe(delay(300));
    }
    return throwError(() => new Error('Order not found'));
  }

  createOrder(orderDto: CreateOrderDto): Observable<Order> {
    const totalAmount = orderDto.items.reduce((sum, item) => sum + item.subtotal, 0);
    const newOrder: Order = {
      id: this.generateId(),
      ...orderDto,
      totalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };
    this.orders.push(newOrder);
    return of(newOrder).pipe(delay(500));
  }

  updateOrder(id: string, updates: UpdateOrderDto): Observable<Order> {
    const index = this.orders.findIndex(o => o.id === id && !o.isDeleted);
    if (index === -1) {
      return throwError(() => new Error('Order not found'));
    }

    this.orders[index] = {
      ...this.orders[index],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.orders[index]).pipe(delay(500));
  }

  deleteOrder(id: string): Observable<void> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      return throwError(() => new Error('Order not found'));
    }

    this.orders[index] = {
      ...this.orders[index],
      isDeleted: true,
      updatedAt: new Date()
    };

    return of(void 0).pipe(delay(500));
  }

  private generateId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
