// API Response interface (matches backend structure)
export interface OrderApiResponse {
  _id: string;
  userId: string;
  restaurantId: string;
  orderItems: OrderItemApi[];
  deliveryStatus: string;
  billAmount: number;
  paymentMode: string;
  isPaymentSuccess: boolean;
  orderDate: string;
  addressDetails?: AddressDetails;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderItemApi {
  menuId: string;
  name: string;
  quantity: number;
  price?: number;
  _id?: string;
}

export interface AddressDetails {
  addressId: string;
  addressDetails: string;
  addressType: string;
  receiverPhoneNumber: string;
  receiverName: string;
  latlong?: string;
  isChosen: boolean;
  isDefault: boolean;
}

// Internal Order model for the application
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  orderItems: OrderItem[];
  deliveryStatus: OrderStatus;
  billAmount: number;
  paymentMode: string;
  isPaymentSuccess: boolean;
  orderDate: Date;
  addressDetails?: AddressDetails;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields for UI
  customerName?: string;
  customerPhone?: string;
}

export interface OrderItem {
  menuId: string;
  name: string;
  quantity: number;
  price?: number;
  subtotal?: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  PREPARING = 'Preparing',
  READY = 'Ready',
  DELIVERY_IN_PROGRESS = 'Delivery in Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface CreateOrderDto {
  userId: string;
  restaurantId: string;
  orderItems: OrderItemApi[];
  billAmount: number;
  paymentMode: string;
  addressDetails?: AddressDetails;
}

export interface UpdateOrderDto {
  deliveryStatus?: string;
  isPaymentSuccess?: boolean;
}

// Mapper function to convert API response to internal Order model
export function mapApiResponseToOrder(apiOrder: OrderApiResponse): Order {
  return {
    id: apiOrder._id,
    userId: apiOrder.userId,
    restaurantId: apiOrder.restaurantId,
    orderItems: apiOrder.orderItems.map(item => ({
      menuId: item.menuId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price ? item.price * item.quantity : 0
    })),
    deliveryStatus: mapDeliveryStatus(apiOrder.deliveryStatus),
    billAmount: apiOrder.billAmount,
    paymentMode: apiOrder.paymentMode,
    isPaymentSuccess: apiOrder.isPaymentSuccess,
    orderDate: new Date(apiOrder.orderDate),
    addressDetails: apiOrder.addressDetails,
    createdAt: new Date(apiOrder.createdAt),
    updatedAt: new Date(apiOrder.updatedAt),
    customerName: apiOrder.addressDetails?.receiverName,
    customerPhone: apiOrder.addressDetails?.receiverPhoneNumber
  };
}

// Map various delivery status strings to our enum
function mapDeliveryStatus(status: string): OrderStatus {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('accept')) return OrderStatus.ACCEPTED;
  if (statusLower.includes('reject')) return OrderStatus.REJECTED;
  if (statusLower.includes('prepar')) return OrderStatus.PREPARING;
  if (statusLower.includes('ready')) return OrderStatus.READY;
  if (statusLower.includes('delivery') || statusLower.includes('progress')) return OrderStatus.DELIVERY_IN_PROGRESS;
  if (statusLower.includes('complete') || statusLower.includes('deliver')) return OrderStatus.COMPLETED;
  if (statusLower.includes('cancel')) return OrderStatus.CANCELLED;
  
  return OrderStatus.PENDING;
}

// Helper to check if order is ongoing
export function isOngoingOrder(status: OrderStatus): boolean {
  return status !== OrderStatus.COMPLETED && 
         status !== OrderStatus.CANCELLED && 
         status !== OrderStatus.REJECTED;
}

// Helper to check if order is in history
export function isHistoryOrder(status: OrderStatus): boolean {
  return status === OrderStatus.COMPLETED || 
         status === OrderStatus.CANCELLED || 
         status === OrderStatus.REJECTED;
}

// Get all available order statuses for dropdown
export function getAllOrderStatuses(): OrderStatus[] {
  return [
    OrderStatus.PENDING,
    OrderStatus.ACCEPTED,
    OrderStatus.REJECTED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.DELIVERY_IN_PROGRESS,
    OrderStatus.COMPLETED
  ];
}

// Get status color for UI
export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return '#FF9800'; // Orange
    case OrderStatus.ACCEPTED:
      return '#2196F3'; // Blue
    case OrderStatus.PREPARING:
      return '#9C27B0'; // Purple
    case OrderStatus.READY:
      return '#4CAF50'; // Green
    case OrderStatus.DELIVERY_IN_PROGRESS:
      return '#00BCD4'; // Cyan
    case OrderStatus.COMPLETED:
      return '#388E3C'; // Dark Green
    case OrderStatus.REJECTED:
    case OrderStatus.CANCELLED:
      return '#F44336'; // Red
    default:
      return '#757575'; // Grey
  }
}

// Get status icon for UI
export function getOrderStatusIcon(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return 'schedule';
    case OrderStatus.ACCEPTED:
      return 'check_circle';
    case OrderStatus.PREPARING:
      return 'restaurant';
    case OrderStatus.READY:
      return 'done_all';
    case OrderStatus.DELIVERY_IN_PROGRESS:
      return 'local_shipping';
    case OrderStatus.COMPLETED:
      return 'verified';
    case OrderStatus.REJECTED:
    case OrderStatus.CANCELLED:
      return 'cancel';
    default:
      return 'help';
  }
}
