// API Response interface (matches backend structure)
export interface UserApiResponse {
  _id: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
}

// Internal User model for the application
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  name: string; // Computed: firstName + lastName
  phone: string; // Computed: countryCode + phoneNumber
  role?: UserRole;
  restaurantId?: string;
  isActive: boolean;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isDeleted?: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER'
}

export interface CreateUserDto {
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  restaurantId?: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  avatar?: string;
}

// Mapper function to convert API response to internal User model
export function mapApiResponseToUser(apiUser: UserApiResponse): User {
  return {
    id: apiUser._id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    phoneNumber: apiUser.phoneNumber,
    countryCode: apiUser.countryCode,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    phone: `${apiUser.countryCode} ${apiUser.phoneNumber}`,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Mock Address interface
export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Mock Order interface
export interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
