import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserFacade } from '../../data/users/ngrx/user.facade';
import { User } from '../../data/users/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  searchControl = new FormControl('');
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'actions'];

  constructor(
    private userFacade: UserFacade,
    private router: Router
  ) {
    this.users$ = this.userFacade.users$;
    this.loading$ = this.userFacade.loading$;
    this.error$ = this.userFacade.error$;

    // Set up filtered users based on search
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([users, searchTerm]) => this.filterUsers(users, searchTerm || ''))
    );
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(forceRefresh = false): void {
    this.userFacade.loadUsers();
  }

  refreshUsers(): void {
    this.loadUsers(true);
  }

  private filterUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm.trim()) {
      return users;
    }

    const search = searchTerm.toLowerCase().trim();
    return users.filter(user => 
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.name?.toLowerCase().includes(search) ||
      user.phoneNumber?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search)
    );
  }

  viewAddresses(user: User): void {
    this.router.navigate(['/users', user.id, 'addresses']);
  }

  viewOrders(user: User): void {
    this.router.navigate(['/users', user.id, 'orders']);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  /**
   * Get user's full name
   */
  getFullName(user: User): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const name = user.name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return name || 'Unknown User';
  }

  /**
   * Get user initials for avatar
   */
  getInitials(user: User): string {
    const fullName = this.getFullName(user);
    const names = fullName.split(' ').filter(n => n.length > 0);
    
    if (names.length === 0) return 'U';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * TrackBy function for performance optimization
   */
  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
