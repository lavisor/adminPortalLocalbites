import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from '../../../../data/menu/models/menu.model';
import { MenuFacade } from '../../../../data/menu/ngrx/menu.facade';
import { RESTAURANT_ID } from '../../../../data/data.const';

@Component({
  selector: 'app-menu-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode = false;
  menuItemId: string | null = null;
  currentItem: MenuItem | null = null;
  isSaving = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuFacade: MenuFacade
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // Get menu item ID from route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.menuItemId = params['id'] || null;
      this.isEditMode = !!this.menuItemId;

      if (this.isEditMode && this.menuItemId) {
        this.loadMenuItem(this.menuItemId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  private loadMenuItem(id: string): void {
    this.menuFacade.getMenuList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        const item = items.find(i => i.id === id);
        if (item) {
          this.currentItem = item;
          this.form.patchValue({
            name: item.name,
            description: item.itemDescription,
            price: item.price,
            classification: item.classification,
            imageUrl: item.imageUrl || '',
            itemAvailable: item.itemAvailable
          });
        }
      });
  }

  onSave(): void {
    if (this.form.valid && !this.isSaving) {
      this.isSaving = true;
      const formValue = this.form.value;
      
      const menuItemData = {
        name: formValue.name,
        itemDescription: formValue.description,
        price: formValue.price,
        classification: formValue.classification,
        imageUrl: formValue.imageUrl,
        itemAvailable: formValue.itemAvailable
      };

      if (this.isEditMode && this.currentItem) {
        // Update existing item
        const updatedItem: MenuItem = {
          ...this.currentItem,
          ...menuItemData
        };
        this.menuFacade.updateMenuItem(this.currentItem.id, updatedItem);
      } else {
        // Create new item
        const newItem: MenuItem = {
          ...menuItemData,
          restaurantId: RESTAURANT_ID,
        } as MenuItem;
        this.menuFacade.createMenuItem(newItem);
      }

      // Navigate back to menu list after a short delay
      setTimeout(() => {
        this.isSaving = false;
        this.router.navigate(['/menu']);
      }, 500);
    }
  }

  onCancel(): void {
    this.router.navigate(['/menu']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
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

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      description: 'Description',
      price: 'Price',
      classification: 'Category',
      imageUrl: 'Image URL'
    };
    return labels[fieldName] || fieldName;
  }

  get imagePreviewUrl(): string | null {
    const url = this.form.get('imageUrl')?.value;
    return url && this.form.get('imageUrl')?.valid ? url : null;
  }
}
