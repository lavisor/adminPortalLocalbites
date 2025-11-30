# Notification Sound

## 🔔 Required File

Place your notification sound file here:
- **Filename**: `notification-bell.mp3`
- **Format**: MP3 (recommended) or WAV
- **Duration**: 1-3 seconds
- **Volume**: Moderate to loud

## 🎵 Where to Get Sound

### Free Sound Libraries:
1. **Mixkit**: https://mixkit.co/free-sound-effects/notification/
2. **Freesound**: https://freesound.org/search/?q=notification%20bell
3. **Pixabay**: https://pixabay.com/sound-effects/search/notification/

### System Sounds (Mac):
```bash
# Copy and convert Mac system sound
cp /System/Library/Sounds/Glass.aiff ./notification-bell.aiff
# Then convert to MP3 using online converter or ffmpeg
```

### Create Your Own:
Use Audacity or any audio software to record/create a bell sound

## ✅ Installation

1. Download or create your notification sound
2. Name it exactly: `notification-bell.mp3`
3. Place it in this directory: `public/assets/sounds/`
4. Restart your development server

## 🧪 Testing

After adding the file:
1. Open the admin portal
2. Click anywhere to preload audio
3. Wait for a new order OR use developer console:
   ```javascript
   window['ng'].getComponent(document.querySelector('app-root')).orderPollingService.testNotification();
   ```

## ⚠️ Note

The app will work without the sound file - you just won't hear audio notifications.
Toast notifications will still appear!
