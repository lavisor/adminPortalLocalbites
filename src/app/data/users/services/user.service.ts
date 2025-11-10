import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../models/user.model';

const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'admin@localbites.com',
    name: 'Admin User',
    phone: '+1-555-0100',
    role: UserRole.ADMIN,
    restaurantId: 'restaurant-123',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: new Date('2025-01-10T09:00:00')
  },
  {
    id: 'user-2',
    email: 'manager@localbites.com',
    name: 'John Manager',
    phone: '+1-555-0101',
    role: UserRole.MANAGER,
    restaurantId: 'restaurant-123',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    lastLoginAt: new Date('2025-01-10T08:30:00')
  },
  {
    id: 'user-3',
    email: 'staff@localbites.com',
    name: 'Jane Staff',
    phone: '+1-555-0102',
    role: UserRole.STAFF,
    restaurantId: 'restaurant-123',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'user-4',
    email: 'inactive@localbites.com',
    name: 'Inactive User',
    phone: '+1-555-0103',
    role: UserRole.STAFF,
    restaurantId: 'restaurant-123',
    isActive: false,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-12-01')
  }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [...MOCK_USERS];

  getUsers(restaurantId?: string): Observable<User[]> {
    const filtered = restaurantId
      ? this.users.filter(u => u.restaurantId === restaurantId && !u.isDeleted)
      : this.users.filter(u => !u.isDeleted);
    return of(filtered).pipe(delay(500));
  }

  getUserById(id: string): Observable<User> {
    const user = this.users.find(u => u.id === id && !u.isDeleted);
    if (user) {
      return of(user).pipe(delay(300));
    }
    return throwError(() => new Error('User not found'));
  }

  createUser(dto: CreateUserDto): Observable<User> {
    const newUser: User = {
      id: this.generateId(),
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      role: dto.role,
      restaurantId: dto.restaurantId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: string, updates: UpdateUserDto): Observable<User> {
    const index = this.users.findIndex(u => u.id === id && !u.isDeleted);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.users[index]).pipe(delay(500));
  }

  deleteUser(id: string): Observable<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    this.users[index] = {
      ...this.users[index],
      isDeleted: true,
      updatedAt: new Date()
    };

    return of(void 0).pipe(delay(500));
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
