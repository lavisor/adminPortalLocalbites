import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Order } from '../models/order.model';
import { OrderState } from '../models/order-state.model';

export const orderAdapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id,
  sortComparer: (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
});

export const initialOrderState: OrderState = orderAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  selectedOrderId: null,
  lastUpdated: null,
  filterStatus: null
});
