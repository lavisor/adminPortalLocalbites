import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderDto, OrderStatus } from '../models/order.model';
import * as OrderActions from './order.actions';
import * as OrderSelectors from './order.selectors';

@Injectable({
  providedIn: 'root'
})
export class OrderFacade {
  // Observables for component consumption
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedOrder$: Observable<Order | null | undefined>;
  filteredOrders$: Observable<Order[]>;
  pendingOrders$: Observable<Order[]>;
  activeOrders$: Observable<Order[]>;
  completedOrders$: Observable<Order[]>;
  totalRevenue$: Observable<number>;
  lastUpdated$: Observable<number | null>;

  constructor(private store: Store) {
    this.orders$ = this.store.select(OrderSelectors.selectAllOrders);
    this.loading$ = this.store.select(OrderSelectors.selectOrderLoading);
    this.loaded$ = this.store.select(OrderSelectors.selectOrderLoaded);
    this.error$ = this.store.select(OrderSelectors.selectOrderError);
    this.selectedOrder$ = this.store.select(OrderSelectors.selectSelectedOrder);
    this.filteredOrders$ = this.store.select(OrderSelectors.selectFilteredOrders);
    this.pendingOrders$ = this.store.select(OrderSelectors.selectPendingOrders);
    this.activeOrders$ = this.store.select(OrderSelectors.selectActiveOrders);
    this.completedOrders$ = this.store.select(OrderSelectors.selectCompletedOrders);
    this.totalRevenue$ = this.store.select(OrderSelectors.selectTotalRevenue);
    this.lastUpdated$ = this.store.select(OrderSelectors.selectOrderLastUpdated);
  }

  loadOrders(restaurantId?: string, forceRefresh = false): void {
    this.store.dispatch(OrderActions.loadOrders({ restaurantId, forceRefresh }));
  }

  loadOrderById(id: string): void {
    this.store.dispatch(OrderActions.loadOrderById({ id }));
  }

  createOrder(order: CreateOrderDto): void {
    this.store.dispatch(OrderActions.createOrder({ order }));
  }

  updateOrder(id: string, updates: UpdateOrderDto): void {
    this.store.dispatch(OrderActions.updateOrder({ id, updates }));
  }

  deleteOrder(id: string): void {
    this.store.dispatch(OrderActions.deleteOrder({ id }));
  }

  selectOrder(id: string | null): void {
    this.store.dispatch(OrderActions.selectOrder({ id }));
  }

  filterByStatus(status: string | null): void {
    this.store.dispatch(OrderActions.filterOrdersByStatus({ status }));
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.store.select(OrderSelectors.selectOrdersByStatus(status));
  }

  getOrderById(id: string): Observable<Order | null | undefined> {
    return this.store.select(OrderSelectors.selectOrderById(id));
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.store.select(OrderSelectors.selectOrdersByUser(userId));
  }

  clearOrderState(): void {
    this.store.dispatch(OrderActions.clearOrderState());
  }

  getOrderList(): Observable<Order[]> {
    return this.orders$;
  }
}
