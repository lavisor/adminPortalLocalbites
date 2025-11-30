import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioNotificationService {
  private audio: HTMLAudioElement | null = null;
  private isAudioLoaded = false;
  private audioPath = '/assets/sounds/notification-bell.mp3';

  constructor() {
    this.initializeAudio();
  }

  /**
   * Initialize the audio element
   */
  private initializeAudio(): void {
    try {
      this.audio = new Audio(this.audioPath);
      this.audio.volume = 1.0; // Maximum volume
      this.audio.load();
      
      // Mark as loaded when ready
      this.audio.addEventListener('canplaythrough', () => {
        this.isAudioLoaded = true;
      });

      // Handle errors
      this.audio.addEventListener('error', (e) => {
        console.error('Error loading notification sound:', e);
        this.isAudioLoaded = false;
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  /**
   * Play the notification sound
   * @param repeat Number of times to repeat (default: 1)
   */
  async playNotification(repeat: number = 1): Promise<void> {
    if (!this.audio || !this.isAudioLoaded) {
      console.warn('Audio not loaded yet');
      return;
    }

    try {
      for (let i = 0; i < repeat; i++) {
        // Reset audio to beginning
        this.audio.currentTime = 0;
        
        // Play and wait for completion
        await this.audio.play();
        
        // Wait for audio to finish before next repeat
        if (i < repeat - 1) {
          await this.waitForAudioEnd();
          // Small delay between repeats
          await this.delay(200);
        }
      }
    } catch (error) {
      // Handle autoplay policy errors
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.warn('Audio playback blocked by browser. User interaction required first.');
      } else {
        console.error('Error playing notification sound:', error);
      }
    }
  }

  /**
   * Play urgent notification (loud, 3 times)
   */
  async playUrgentNotification(): Promise<void> {
    await this.playNotification(3);
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Check if audio is ready to play
   */
  isReady(): boolean {
    return this.isAudioLoaded && this.audio !== null;
  }

  /**
   * Preload audio (call this on user interaction to bypass autoplay policy)
   */
  async preload(): Promise<void> {
    if (!this.audio) {
      this.initializeAudio();
      return;
    }

    try {
      // Try to play and immediately pause to preload
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.audio.pause();
        this.audio.currentTime = 0;
      }
    } catch (error) {
      // Ignore errors during preload
      console.debug('Preload attempt:', error);
    }
  }

  /**
   * Wait for audio to finish playing
   */
  private waitForAudioEnd(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audio) {
        resolve();
        return;
      }

      const handler = () => {
        this.audio?.removeEventListener('ended', handler);
        resolve();
      };

      this.audio.addEventListener('ended', handler);
    });
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test the notification sound
   */
  async test(): Promise<void> {
    console.log('Testing notification sound...');
    await this.playNotification(1);
  }
}
