import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';
import { OrderState } from '../models/order-state.model';
import { isOngoingOrder, isHistoryOrder } from '../models/order.model';

export const initialState: OrderState = {
  orders: [],
  selectedOrderId: null,
  loading: false,
  loaded: false,
  error: null,
  lastUpdated: null,
  filters: {
    status: null,
    searchTerm: '',
    tab: 'ongoing'
  }
};

export const orderReducer = createReducer(
  initialState,

  // Load Orders
  on(OrderActions.loadOrders, (state, { forceRefresh }) => ({
    ...state,
    loading: true,
    error: null,
    ...(forceRefresh ? { loaded: false } : {})
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
    loaded: true,
    error: null,
    lastUpdated: Date.now()
  })),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  })),

  // Load Order By ID
  on(OrderActions.loadOrderById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadOrderByIdSuccess, (state, { order }) => {
    const existingIndex = state.orders.findIndex(o => o.id === order.id);
    const orders = existingIndex >= 0
      ? state.orders.map(o => o.id === order.id ? order : o)
      : [...state.orders, order];

    return {
      ...state,
      orders,
      loading: false,
      error: null
    };
  }),

  on(OrderActions.loadOrderByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Order
  on(OrderActions.createOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.createOrderSuccess, (state, { order }) => ({
    ...state,
    orders: [order, ...state.orders],
    loading: false,
    error: null,
    lastUpdated: Date.now()
  })),

  on(OrderActions.createOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Order
  on(OrderActions.updateOrder, OrderActions.updateOrderStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.updateOrderSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o),
    loading: false,
    error: null,
    lastUpdated: Date.now()
  })),

  on(OrderActions.updateOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Order
  on(OrderActions.deleteOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.deleteOrderSuccess, (state, { id }) => ({
    ...state,
    orders: state.orders.filter(o => o.id !== id),
    loading: false,
    error: null,
    selectedOrderId: state.selectedOrderId === id ? null : state.selectedOrderId,
    lastUpdated: Date.now()
  })),

  on(OrderActions.deleteOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Select Order
  on(OrderActions.selectOrder, (state, { id }) => ({
    ...state,
    selectedOrderId: id
  })),

  // Filter Orders
  on(OrderActions.filterOrdersByStatus, (state, { status }) => ({
    ...state,
    filters: {
      ...state.filters,
      status
    }
  })),

  on(OrderActions.filterOrdersBySearch, (state, { searchTerm }) => ({
    ...state,
    filters: {
      ...state.filters,
      searchTerm
    }
  })),

  on(OrderActions.setOrderTab, (state, { tab }) => ({
    ...state,
    filters: {
      ...state.filters,
      tab
    }
  })),

  // Clear State
  on(OrderActions.clearOrderState, () => initialState),

  // Refresh Orders
  on(OrderActions.refreshOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
);
