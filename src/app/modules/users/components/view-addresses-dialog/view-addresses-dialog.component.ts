import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { User, Address } from '../../../../data/users/models/user.model';

@Component({
  selector: 'app-view-addresses-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './view-addresses-dialog.component.html',
  styleUrls: ['./view-addresses-dialog.component.scss']
})
export class ViewAddressesDialogComponent {
  addresses: Address[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViewAddressesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    // Generate mock addresses for the user
    this.addresses = this.generateMockAddresses(data.user.id);
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
        street: '789 Park Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400003',
        isDefault: false
      }
    ];
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
