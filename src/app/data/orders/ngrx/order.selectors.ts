import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../models/order-state.model';
import { orderAdapter } from './order.state';
import { OrderStatus } from '../models/order.model';

// Feature selector
export const selectOrderState = createFeatureSelector<OrderState>('orders');

// Entity selectors
const { selectAll, selectEntities, selectIds, selectTotal } = orderAdapter.getSelectors();

// Select all orders
export const selectAllOrders = createSelector(
  selectOrderState,
  selectAll
);

// Select order entities
export const selectOrderEntities = createSelector(
  selectOrderState,
  selectEntities
);

// Select order IDs
export const selectOrderIds = createSelector(
  selectOrderState,
  selectIds
);

// Select total count
export const selectOrderTotal = createSelector(
  selectOrderState,
  selectTotal
);

// Select loading state
export const selectOrderLoading = createSelector(
  selectOrderState,
  (state) => state.loading
);

// Select loaded state
export const selectOrderLoaded = createSelector(
  selectOrderState,
  (state) => state.loaded
);

// Select error state
export const selectOrderError = createSelector(
  selectOrderState,
  (state) => state.error
);

// Select last updated
export const selectOrderLastUpdated = createSelector(
  selectOrderState,
  (state) => state.lastUpdated
);

// Select selected order ID
export const selectSelectedOrderId = createSelector(
  selectOrderState,
  (state) => state.selectedOrderId
);

// Select the selected order
export const selectSelectedOrder = createSelector(
  selectOrderEntities,
  selectSelectedOrderId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Select filter status
export const selectFilterStatus = createSelector(
  selectOrderState,
  (state) => state.filterStatus
);

// Select filtered orders
export const selectFilteredOrders = createSelector(
  selectAllOrders,
  selectFilterStatus,
  (orders, filterStatus) => {
    if (!filterStatus) return orders;
    return orders.filter(order => order.status === filterStatus);
  }
);

// Select orders by status
export const selectOrdersByStatus = (status: OrderStatus) =>
  createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => order.status === status)
  );

// Select pending orders
export const selectPendingOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter((order) => order.status === OrderStatus.PENDING)
);

// Select active orders (not delivered or cancelled)
export const selectActiveOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter((order) => 
    order.status !== OrderStatus.DELIVERED && 
    order.status !== OrderStatus.CANCELLED
  )
);

// Select completed orders
export const selectCompletedOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter((order) => order.status === OrderStatus.DELIVERED)
);

// Select total revenue
export const selectTotalRevenue = createSelector(
  selectAllOrders,
  (orders) => orders
    .filter(order => order.status === OrderStatus.DELIVERED)
    .reduce((sum, order) => sum + order.totalAmount, 0)
);

// Select order by ID
export const selectOrderById = (id: string) =>
  createSelector(selectOrderEntities, (entities) => entities[id] || null);

// Select orders by user
export const selectOrdersByUser = (userId: string) =>
  createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => order.userId === userId)
  );
