import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { OrderPollingService } from './services/order-polling.service';
import { PushNotificationService } from './services/push-notification.service';

type BannerState = 'hidden' | 'enabled' | 'disabled';

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
  private pushAutoPromptAttempted = false;
  private permissionSub: Subscription | null = null;

  bannerState = signal<BannerState>('hidden');
  busy = signal(false);

  constructor(
    private orderPollingService: OrderPollingService,
    private pushNotificationService: PushNotificationService
  ) {}

  ngOnInit(): void {
    this.orderPollingService.startPolling();
    console.log('✅ Order polling service initialized');

    this.pushNotificationService.syncExistingSubscription();

    this.permissionSub = this.pushNotificationService.getPermission$().subscribe((state) => {
      if (state === 'granted') {
        this.bannerState.set('enabled');
      } else if (state === 'denied') {
        this.bannerState.set('disabled');
      } else {
        // 'default' or 'unsupported' → keep banner hidden; auto-prompt will run on first tap
        this.bannerState.set('hidden');
      }
    });
  }

  /**
   * First user gesture: preload audio (existing behavior) AND auto-trigger the
   * push permission prompt if the user hasn't decided yet. The gesture is
   * required by iOS Safari; Android Chrome doesn't require it but having it
   * keeps the flow consistent.
   */
  @HostListener('document:click')
  @HostListener('document:keydown')
  async onUserInteraction(): Promise<void> {
    if (!this.audioPreloaded) {
      await this.orderPollingService.preloadAudio();
      this.audioPreloaded = true;
    }

    if (!this.pushAutoPromptAttempted && this.pushNotificationService.isSupported()) {
      this.pushAutoPromptAttempted = true;
      if ('Notification' in window && Notification.permission === 'default') {
        await this.pushNotificationService.enable();
      }
    }
  }

  async enablePush(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.pushNotificationService.enable();
    } finally {
      this.busy.set(false);
    }
  }

  async disablePush(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.pushNotificationService.unsubscribe();
      // After unsubscribe, browser permission may still be 'granted' but we're
      // not subscribed anymore. Force the banner into 'disabled' state so the
      // user has an obvious path back.
      this.bannerState.set('disabled');
    } finally {
      this.busy.set(false);
    }
  }

  ngOnDestroy(): void {
    this.orderPollingService.stopPolling();
    this.permissionSub?.unsubscribe();
  }
}
