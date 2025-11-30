import { OrderState } from '../models/order-state.model';

export const initialOrderState: OrderState = {
  orders: [],
  loading: false,
  loaded: false,
  error: null,
  selectedOrderId: null,
  lastUpdated: null,
  filters: {
    status: null,
    searchTerm: '',
    tab: 'ongoing'
  }
};
