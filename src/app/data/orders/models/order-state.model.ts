import { Order } from './order.model';

export interface OrderState {
  orders: Order[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedOrderId: string | null;
  lastUpdated: number | null;
  filters: {
    status: string | null;
    searchTerm: string;
    tab: 'ongoing' | 'history';
  };
}
