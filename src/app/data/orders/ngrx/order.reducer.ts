import { createReducer, on } from '@ngrx/store';
import { orderAdapter, initialOrderState } from './order.state';
import * as OrderActions from './order.actions';

export const orderReducer = createReducer(
  initialOrderState,

  // Load Orders
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders }) =>
    orderAdapter.setAll(orders, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      lastUpdated: Date.now()
    })
  ),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  })),

  // Load Single Order
  on(OrderActions.loadOrderById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.loadOrderByIdSuccess, (state, { order }) =>
    orderAdapter.upsertOne(order, {
      ...state,
      loading: false,
      error: null
    })
  ),

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

  on(OrderActions.createOrderSuccess, (state, { order }) =>
    orderAdapter.addOne(order, {
      ...state,
      loading: false,
      error: null,
      lastUpdated: Date.now()
    })
  ),

  on(OrderActions.createOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Order
  on(OrderActions.updateOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OrderActions.updateOrderSuccess, (state, { order }) =>
    orderAdapter.updateOne(
      { id: order.id, changes: order },
      {
        ...state,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      }
    )
  ),

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

  on(OrderActions.deleteOrderSuccess, (state, { id }) =>
    orderAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
      selectedOrderId: state.selectedOrderId === id ? null : state.selectedOrderId,
      lastUpdated: Date.now()
    })
  ),

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
    filterStatus: status
  })),

  // Clear Order State
  on(OrderActions.clearOrderState, () => initialOrderState)
);
