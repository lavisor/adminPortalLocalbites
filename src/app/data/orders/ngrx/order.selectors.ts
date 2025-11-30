import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../models/order-state.model';
import { Order, OrderStatus, isOngoingOrder, isHistoryOrder } from '../models/order.model';

export const selectOrderState = createFeatureSelector<OrderState>('orders');

// Base selectors
export const selectAllOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.orders
);

export const selectOrderLoading = createSelector(
  selectOrderState,
  (state: OrderState) => state.loading
);

export const selectOrderLoaded = createSelector(
  selectOrderState,
  (state: OrderState) => state.loaded
);

export const selectOrderError = createSelector(
  selectOrderState,
  (state: OrderState) => state.error
);

export const selectOrderLastUpdated = createSelector(
  selectOrderState,
  (state: OrderState) => state.lastUpdated
);

export const selectOrderFilters = createSelector(
  selectOrderState,
  (state: OrderState) => state.filters
);

export const selectSelectedOrderId = createSelector(
  selectOrderState,
  (state: OrderState) => state.selectedOrderId
);

// Selected order
export const selectSelectedOrder = createSelector(
  selectAllOrders,
  selectSelectedOrderId,
  (orders: Order[], selectedId: string | null) => 
    selectedId ? orders.find(order => order.id === selectedId) : null
);

// Order by ID
export const selectOrderById = (id: string) => createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.find(order => order.id === id)
);

// Orders by user
export const selectOrdersByUser = (userId: string) => createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => order.userId === userId)
);

// Orders by status
export const selectOrdersByStatus = (status: OrderStatus) => createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => order.deliveryStatus === status)
);

// Ongoing orders (not completed, cancelled, or rejected)
export const selectOngoingOrders = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => isOngoingOrder(order.deliveryStatus))
);

// History orders (completed, cancelled, or rejected)
export const selectHistoryOrders = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => isHistoryOrder(order.deliveryStatus))
);

// Filtered orders based on current filters
export const selectFilteredOrders = createSelector(
  selectAllOrders,
  selectOrderFilters,
  (orders: Order[], filters) => {
    let filtered = [...orders];

    // Filter by tab (ongoing/history)
    if (filters.tab === 'ongoing') {
      filtered = filtered.filter(order => isOngoingOrder(order.deliveryStatus));
    } else if (filters.tab === 'history') {
      filtered = filtered.filter(order => isHistoryOrder(order.deliveryStatus));
    }

    // Filter by specific status
    if (filters.status) {
      filtered = filtered.filter(order => order.deliveryStatus === filters.status);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const matchesId = order.id.toLowerCase().includes(searchLower);
        const matchesCustomerName = order.customerName?.toLowerCase().includes(searchLower);
        const matchesCustomerPhone = order.customerPhone?.includes(searchLower);
        const matchesItems = order.orderItems.some(item => 
          item.name.toLowerCase().includes(searchLower)
        );
        
        return matchesId || matchesCustomerName || matchesCustomerPhone || matchesItems;
      });
    }

    // Sort by order date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }
);

// Pending orders
export const selectPendingOrders = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => order.deliveryStatus === OrderStatus.PENDING)
);

// Active orders (accepted, preparing, ready, or in delivery)
export const selectActiveOrders = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => 
    order.deliveryStatus === OrderStatus.ACCEPTED ||
    order.deliveryStatus === OrderStatus.PREPARING ||
    order.deliveryStatus === OrderStatus.READY ||
    order.deliveryStatus === OrderStatus.DELIVERY_IN_PROGRESS
  )
);

// Completed orders
export const selectCompletedOrders = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.filter(order => order.deliveryStatus === OrderStatus.COMPLETED)
);

// Total revenue
export const selectTotalRevenue = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.reduce((total, order) => total + order.billAmount, 0)
);

// Count selectors
export const selectOrdersCount = createSelector(
  selectAllOrders,
  (orders: Order[]) => orders.length
);

export const selectOngoingOrdersCount = createSelector(
  selectOngoingOrders,
  (orders: Order[]) => orders.length
);

export const selectHistoryOrdersCount = createSelector(
  selectHistoryOrders,
  (orders: Order[]) => orders.length
);

export const selectPendingOrdersCount = createSelector(
  selectPendingOrders,
  (orders: Order[]) => orders.length
);
