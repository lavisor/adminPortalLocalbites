import { createAction, props } from '@ngrx/store';
import { Order, CreateOrderDto, UpdateOrderDto } from '../models/order.model';

// Load Orders
export const loadOrders = createAction(
  '[Order] Load Orders',
  props<{ restaurantId?: string; forceRefresh?: boolean }>()
);

export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  '[Order] Load Orders Failure',
  props<{ error: string }>()
);

// Load Order By ID
export const loadOrderById = createAction(
  '[Order] Load Order By ID',
  props<{ id: string }>()
);

export const loadOrderByIdSuccess = createAction(
  '[Order] Load Order By ID Success',
  props<{ order: Order }>()
);

export const loadOrderByIdFailure = createAction(
  '[Order] Load Order By ID Failure',
  props<{ error: string }>()
);

// Create Order
export const createOrder = createAction(
  '[Order] Create Order',
  props<{ order: CreateOrderDto }>()
);

export const createOrderSuccess = createAction(
  '[Order] Create Order Success',
  props<{ order: Order }>()
);

export const createOrderFailure = createAction(
  '[Order] Create Order Failure',
  props<{ error: string }>()
);

// Update Order
export const updateOrder = createAction(
  '[Order] Update Order',
  props<{ id: string; updates: UpdateOrderDto }>()
);

export const updateOrderSuccess = createAction(
  '[Order] Update Order Success',
  props<{ order: Order }>()
);

export const updateOrderFailure = createAction(
  '[Order] Update Order Failure',
  props<{ error: string }>()
);

// Update Order Status
export const updateOrderStatus = createAction(
  '[Order] Update Order Status',
  props<{ id: string; status: string }>()
);

// Delete Order
export const deleteOrder = createAction(
  '[Order] Delete Order',
  props<{ id: string }>()
);

export const deleteOrderSuccess = createAction(
  '[Order] Delete Order Success',
  props<{ id: string }>()
);

export const deleteOrderFailure = createAction(
  '[Order] Delete Order Failure',
  props<{ error: string }>()
);

// Select Order
export const selectOrder = createAction(
  '[Order] Select Order',
  props<{ id: string | null }>()
);

// Filter Orders
export const filterOrdersByStatus = createAction(
  '[Order] Filter Orders By Status',
  props<{ status: string | null }>()
);

export const filterOrdersBySearch = createAction(
  '[Order] Filter Orders By Search',
  props<{ searchTerm: string }>()
);

export const setOrderTab = createAction(
  '[Order] Set Order Tab',
  props<{ tab: 'ongoing' | 'history' }>()
);

// Clear State
export const clearOrderState = createAction('[Order] Clear Order State');

// Refresh Orders
export const refreshOrders = createAction('[Order] Refresh Orders');
