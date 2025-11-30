import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  Order, 
  CreateOrderDto, 
  UpdateOrderDto, 
  OrderApiResponse,
  mapApiResponseToOrder
} from '../models/order.model';
import { BACKEND_URL, RESTAURANT_ID } from '../../data.const';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${BACKEND_URL}/api/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get all orders for the restaurant
   */
  getOrders(restaurantId: string = RESTAURANT_ID): Observable<Order[]> {
    return this.http.get<OrderApiResponse[]>(
      `${this.apiUrl}/restaurant/${restaurantId}`
    ).pipe(
      map(response => {
        if (response && Array.isArray(response)) {
          return response.map(apiOrder => mapApiResponseToOrder(apiOrder));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Failed to fetch orders'));
      })
    );
  }

  /**
   * Get a single order by ID
   */
  getOrderById(orderId: string): Observable<Order> {
    // Note: The API doesn't have a direct endpoint for single order by ID
    // So we'll fetch all orders and filter
    return this.getOrders().pipe(
      map(orders => {
        const order = orders.find(o => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        return order;
      }),
      catchError(error => {
        console.error('Error fetching order by ID:', error);
        return throwError(() => new Error('Failed to fetch order'));
      })
    );
  }

  /**
   * Get orders for a specific user
   */
  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<OrderApiResponse[]>(
      `${this.apiUrl}/user/${userId}`
    ).pipe(
      map(response => {
        if (response && Array.isArray(response)) {
          return response.map(apiOrder => mapApiResponseToOrder(apiOrder));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching user orders:', error);
        return throwError(() => new Error('Failed to fetch user orders'));
      })
    );
  }

  /**
   * Create a new order
   */
  createOrder(orderDto: CreateOrderDto): Observable<Order> {
    return this.http.post<OrderApiResponse>(this.apiUrl, orderDto).pipe(
      map(apiOrder => mapApiResponseToOrder(apiOrder)),
      catchError(error => {
        console.error('Error creating order:', error);
        return throwError(() => new Error('Failed to create order'));
      })
    );
  }

  /**
   * Update an existing order
   */
  updateOrder(orderId: string, updates: UpdateOrderDto): Observable<Order> {
    return this.http.patch<OrderApiResponse>(
      `${this.apiUrl}/${orderId}`,
      updates
    ).pipe(
      map(apiOrder => mapApiResponseToOrder(apiOrder)),
      catchError(error => {
        console.error('Error updating order:', error);
        return throwError(() => new Error('Failed to update order'));
      })
    );
  }

  /**
   * Update order delivery status
   */
  updateOrderStatus(orderId: string, deliveryStatus: string): Observable<Order> {
    return this.updateOrder(orderId, { deliveryStatus });
  }

  /**
   * Delete/Cancel an order (if supported by backend)
   */
  deleteOrder(orderId: string): Observable<void> {
    // Note: The API might not support deletion
    // This is a placeholder for potential future implementation
    return this.updateOrder(orderId, { deliveryStatus: 'Cancelled' }).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error deleting order:', error);
        return throwError(() => new Error('Failed to delete order'));
      })
    );
  }
}
