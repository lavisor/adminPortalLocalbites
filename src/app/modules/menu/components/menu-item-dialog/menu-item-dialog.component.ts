import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuItem } from '../../../../data/menu/models/menu.model';

@Component({
  selector: 'app-menu-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './menu-item-dialog.component.html',
  styleUrls: ['./menu-item-dialog.component.scss']
})
export class MenuItemDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MenuItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: MenuItem | null }
  ) {
    this.isEditMode = !!data.item;
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.data.item) {
      this.form.patchValue({
        name: this.data.item.name,
        description: this.data.item.itemDescription,
        price: this.data.item.price,
        classification: this.data.item.classification,
        imageUrl: this.data.item.imageUrl || '',
        itemAvailable: this.data.item.itemAvailable
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      classification: ['', [Validators.required]],
      imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      itemAvailable: [true]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Map form fields to MenuItem model fields
      const menuItemData = {
        name: formValue.name,
        itemDescription: formValue.description,  // Map description → itemDescription
        price: formValue.price,
        classification: formValue.classification,
        imageUrl: formValue.imageUrl,
        itemAvailable: formValue.itemAvailable
      };
      
      const action = this.isEditMode ? 'save' : 'add';
      this.dialogRef.close({
        action: action,
        data: menuItemData
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field.hasError('maxlength')) {
      const max = field.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${max} characters`;
    }
    if (field.hasError('minlength')) {
      const min = field.errors?.['minlength'].requiredLength;
      return `Minimum length is ${min} characters`;
    }
    if (field.hasError('min')) {
      return 'Value must be positive';
    }
    if (field.hasError('pattern')) {
      return 'Please enter a valid URL (http:// or https://)';
    }
    return '';
  }
}
