import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: string;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a toast notification
   */
  show(config: ToastConfig): MatSnackBarRef<any> {
    const snackBarConfig: MatSnackBarConfig = {
      duration: config.duration || 5000,
      horizontalPosition: config.horizontalPosition || 'right',
      verticalPosition: config.verticalPosition || 'top',
      panelClass: this.getPanelClass(config.type || 'info')
    };

    return this.snackBar.open(
      config.message,
      config.action || 'Close',
      snackBarConfig
    );
  }

  /**
   * Show success toast
   */
  success(message: string, duration: number = 3000, action?: string): MatSnackBarRef<any> {
    return this.show({
      message,
      type: 'success',
      duration,
      action
    });
  }

  /**
   * Show error toast
   */
  error(message: string, duration: number = 5000, action?: string): MatSnackBarRef<any> {
    return this.show({
      message,
      type: 'error',
      duration,
      action
    });
  }

  /**
   * Show warning toast
   */
  warning(message: string, duration: number = 4000, action?: string): MatSnackBarRef<any> {
    return this.show({
      message,
      type: 'warning',
      duration,
      action
    });
  }

  /**
   * Show info toast
   */
  info(message: string, duration: number = 3000, action?: string): MatSnackBarRef<any> {
    return this.show({
      message,
      type: 'info',
      duration,
      action
    });
  }

  /**
   * Show toast with custom action callback
   */
  showWithAction(
    message: string,
    action: string,
    callback: () => void,
    type: ToastType = 'info',
    duration: number = 10000
  ): void {
    const snackBarRef = this.show({
      message,
      type,
      duration,
      action
    });

    snackBarRef.onAction().subscribe(() => {
      callback();
    });
  }

  /**
   * Dismiss all toasts
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }

  /**
   * Get panel class based on toast type
   */
  private getPanelClass(type: ToastType): string[] {
    const baseClass = 'custom-toast';
    const typeClass = `toast-${type}`;
    return [baseClass, typeClass];
  }
}
