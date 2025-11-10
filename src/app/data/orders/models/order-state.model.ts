import { EntityState } from '@ngrx/entity';
import { Order } from './order.model';

export interface OrderState extends EntityState<Order> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedOrderId: string | null;
  lastUpdated: number | null;
  filterStatus: string | null;
}
