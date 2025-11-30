import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrderPollingService } from './services/order-polling.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'admin-portal';
  private audioPreloaded = false;

  constructor(private orderPollingService: OrderPollingService) {}

  ngOnInit(): void {
    // Start order polling service
    this.orderPollingService.startPolling();
    console.log('✅ Order polling service initialized');
  }

  /**
   * Preload audio on first user interaction
   * This bypasses browser autoplay restrictions
   */
  @HostListener('document:click')
  @HostListener('document:keydown')
  async onUserInteraction(): Promise<void> {
    if (!this.audioPreloaded) {
      await this.orderPollingService.preloadAudio();
      this.audioPreloaded = true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup polling service
    this.orderPollingService.stopPolling();
  }
}
