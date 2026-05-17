import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BACKEND_URL, RESTAURANT_ID, VAPID_PUBLIC_KEY } from '../data/data.const';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private readonly subscribeUrl = `${BACKEND_URL}/api/push/subscribe`;
  private readonly unsubscribeUrl = `${BACKEND_URL}/api/push/unsubscribe`;
  private permission$ = new BehaviorSubject<PermissionState>(this.currentPermission());
  private initialized = false;

  constructor(
    private swPush: SwPush,
    private http: HttpClient,
    private router: Router
  ) {
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      const url = (notification.data && (notification.data as any).url) || '/orders';
      this.router.navigateByUrl(url);
    });
  }

  getPermission$() {
    return this.permission$.asObservable();
  }

  isSupported(): boolean {
    return this.swPush.isEnabled && 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Re-register an existing subscription on app start so the backend can refresh
   * last_seen_at and self-heal rotated endpoints. Safe to call repeatedly.
   */
  async syncExistingSubscription(): Promise<void> {
    if (this.initialized || !this.isSupported()) return;
    this.initialized = true;

    try {
      const sub = await firstValueFrom(this.swPush.subscription);
      if (sub) {
        await this.postSubscription(sub);
      }
    } catch (err) {
      console.warn('Push sync failed:', err);
    }
  }

  /**
   * Request notification permission and create a subscription. Must be called
   * from within a user gesture handler on iOS/Safari.
   */
  async enable(): Promise<PermissionState> {
    if (!this.isSupported()) {
      this.permission$.next('unsupported');
      return 'unsupported';
    }

    if (!VAPID_PUBLIC_KEY) {
      console.warn('VAPID_PUBLIC_KEY not configured — push subscription skipped');
      return this.currentPermission();
    }

    const current = this.currentPermission();
    if (current === 'denied') {
      this.permission$.next('denied');
      return 'denied';
    }

    try {
      const sub = await this.swPush.requestSubscription({ serverPublicKey: VAPID_PUBLIC_KEY });
      await this.postSubscription(sub);
      this.permission$.next('granted');
      return 'granted';
    } catch (err: any) {
      const state = this.currentPermission();
      this.permission$.next(state);
      console.warn('Push subscription failed:', err?.message || err);
      return state;
    }
  }

  private currentPermission(): PermissionState {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission as PermissionState;
  }

  /**
   * Unsubscribe browser-side AND notify the backend so the row is deleted
   * immediately (rather than waiting for the next push attempt to 410).
   */
  async unsubscribe(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      const sub = await firstValueFrom(this.swPush.subscription);
      const endpoint = sub?.endpoint;

      await this.swPush.unsubscribe().catch(() => {});

      if (endpoint) {
        await firstValueFrom(
          this.http.post(this.unsubscribeUrl, { endpoint })
        ).catch((err) => {
          console.warn('Backend unsubscribe failed (will self-heal on next push 410):', err);
        });
      }

      this.permission$.next(this.currentPermission());
    } catch (err) {
      console.warn('Unsubscribe failed:', err);
    }
  }

  private async postSubscription(sub: PushSubscription): Promise<void> {
    const body = {
      subscription: sub.toJSON(),
      restaurantId: RESTAURANT_ID,
    };
    await firstValueFrom(this.http.post(this.subscribeUrl, body));
  }
}
