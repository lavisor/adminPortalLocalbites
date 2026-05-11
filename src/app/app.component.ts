import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { OrderPollingService } from './services/order-polling.service';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'admin-portal';
  private audioPreloaded = false;
  private permissionSub: Subscription | null = null;

  showPushBanner = signal(false);
  pushBlocked = signal(false);

  constructor(
    private orderPollingService: OrderPollingService,
    private pushNotificationService: PushNotificationService
  ) {}

  ngOnInit(): void {
    this.orderPollingService.startPolling();
    console.log('✅ Order polling service initialized');

    this.pushNotificationService.syncExistingSubscription();

    this.permissionSub = this.pushNotificationService.getPermission$().subscribe((state) => {
      this.showPushBanner.set(state === 'default');
      this.pushBlocked.set(state === 'denied');
    });
  }

  @HostListener('document:click')
  @HostListener('document:keydown')
  async onUserInteraction(): Promise<void> {
    if (!this.audioPreloaded) {
      await this.orderPollingService.preloadAudio();
      this.audioPreloaded = true;
    }
  }

  async enablePush(): Promise<void> {
    await this.pushNotificationService.enable();
  }

  dismissPushBanner(): void {
    this.showPushBanner.set(false);
  }

  ngOnDestroy(): void {
    this.orderPollingService.stopPolling();
    this.permissionSub?.unsubscribe();
  }
}
