import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { User, Address } from '../../../../data/users/models/user.model';
import { UserFacade } from '../../../../data/users/ngrx/user.facade';

@Component({
  selector: 'app-user-addresses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-addresses.component.html',
  styleUrls: ['./user-addresses.component.scss']
})
export class UserAddressesComponent implements OnInit, OnDestroy {
  user: User | null = null;
  addresses: Address[] = [];
  loading = true;
  userId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userFacade: UserFacade
  ) {}

  ngOnInit(): void {
    // Get userId from route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.userId = params['userId'];
      this.loadUserAndAddresses();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserAndAddresses(): void {
    this.loading = true;
    
    // Get user from store
    this.userFacade.users$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.user = users.find(u => u.id === this.userId) || null;
      
      if (this.user) {
        // Generate mock addresses for now
        this.addresses = this.generateMockAddresses(this.userId);
      }
      
      this.loading = false;
    });
  }

  private generateMockAddresses(userId: string): Address[] {
    return [
      {
        id: `addr-${userId}-1`,
        label: 'Home',
        street: '123 Main Street, Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        isDefault: true
      },
      {
        id: `addr-${userId}-2`,
        label: 'Work',
        street: '456 Business Park, Floor 3',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400002',
        isDefault: false
      },
      {
        id: `addr-${userId}-3`,
        label: 'Other',
        street: '789 Park Avenue, Near Central Mall',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400003',
        isDefault: false
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getAddressIcon(label: string): string {
    const icons: { [key: string]: string } = {
      'Home': 'home',
      'Work': 'work',
      'Other': 'location_on'
    };
    return icons[label] || 'location_on';
  }

  getUserName(): string {
    if (!this.user) return 'User';
    
    const firstName = this.user.firstName || '';
    const lastName = this.user.lastName || '';
    const name = this.user.name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return name || 'Unknown User';
  }

  getUserPhone(): string {
    return this.user?.phone || this.user?.phoneNumber || 'N/A';
  }
}
