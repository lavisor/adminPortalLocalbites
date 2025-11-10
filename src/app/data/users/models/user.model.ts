export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  restaurantId?: string;
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
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
