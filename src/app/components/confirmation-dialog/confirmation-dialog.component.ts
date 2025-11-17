import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    // Set defaults
    this.data.primaryButtonText = data.primaryButtonText || 'Confirm';
    this.data.secondaryButtonText = data.secondaryButtonText || 'Cancel';
    this.data.primaryButtonColor = data.primaryButtonColor || 'primary';
  }

  onSecondaryClick(): void {
    this.dialogRef.close(false);
  }

  onPrimaryClick(): void {
    this.dialogRef.close(true);
  }
}
