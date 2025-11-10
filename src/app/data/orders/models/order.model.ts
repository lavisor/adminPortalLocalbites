export interface Order {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: DeliveryAddress;
  orderDate: Date;
  deliveryTime?: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CreateOrderDto {
  restaurantId: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  specialInstructions?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryTime?: Date;
  specialInstructions?: string;
}
