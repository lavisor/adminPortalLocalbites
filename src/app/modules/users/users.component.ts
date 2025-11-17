import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserFacade } from '../../data/users/ngrx/user.facade';
import { User } from '../../data/users/models/user.model';
import { ViewAddressesDialogComponent } from './components/view-addresses-dialog/view-addresses-dialog.component';
import { ViewOrdersDialogComponent } from './components/view-orders-dialog/view-orders-dialog.component';

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
    MatDialogModule
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
    private dialog: MatDialog
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
    this.dialog.open(ViewAddressesDialogComponent, {
      width: '600px',
      data: { user }
    });
  }

  viewOrders(user: User): void {
    this.dialog.open(ViewOrdersDialogComponent, {
      width: '900px',
      data: { user }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
