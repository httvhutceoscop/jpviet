// PWA Management
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.checkForUpdates();
    this.setupOfflineDetection();
  }

  // Register Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    }
  }

  // Setup install prompt
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  // Show install button
  showInstallButton() {
    // Update sidebar install button if available
    const sidebarInstallBtn = document.getElementById('pwa-install-btn');
    if (sidebarInstallBtn) {
      sidebarInstallBtn.style.display = 'block';
      sidebarInstallBtn.disabled = false;
    }
    
    // Also show header button for backward compatibility
    if (!this.installButton) {
      this.createInstallButton();
    }
    this.installButton.style.display = 'block';
  }

  // Hide install button
  hideInstallButton() {
    // Hide sidebar install button if available
    const sidebarInstallBtn = document.getElementById('pwa-install-btn');
    if (sidebarInstallBtn) {
      sidebarInstallBtn.style.display = 'none';
      sidebarInstallBtn.disabled = true;
    }
    
    // Hide header button
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  // Create install button
  createInstallButton() {
    this.installButton = document.createElement('button');
    this.installButton.textContent = '📱 Cài đặt App';
    this.installButton.className = 'pwa-install-btn';
    this.installButton.addEventListener('click', () => this.installApp());
    
    // Add to header
    const header = document.querySelector('.site-header');
    if (header) {
      header.appendChild(this.installButton);
    }
  }

  // Install app
  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
      this.hideInstallButton();
    }
  }

  // Check for updates
  checkForUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
        this.showUpdateNotification();
      });
    }
  }

  // Show update notification
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <span>🔄 Có phiên bản mới! Tải lại trang để cập nhật.</span>
      <button onclick="location.reload()">Cập nhật</button>
      <button onclick="this.parentElement.remove()">Đóng</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  // Setup offline detection
  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.showOnlineStatus('🟢 Đã kết nối lại');
    });

    window.addEventListener('offline', () => {
      this.showOnlineStatus('🔴 Đang offline - Dữ liệu từ cache');
    });
  }

  // Show online/offline status
  showOnlineStatus(message) {
    const status = document.createElement('div');
    status.className = 'pwa-status';
    status.textContent = message;
    
    document.body.appendChild(status);
    
    setTimeout(() => {
      if (status.parentElement) {
        status.remove();
      }
    }, 3000);
  }

  // Get app info
  getAppInfo() {
    return {
      isInstalled: window.matchMedia('(display-mode: standalone)').matches,
      isOnline: navigator.onLine,
      hasServiceWorker: 'serviceWorker' in navigator
    };
  }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
});

// Add PWA styles
const pwaStyles = `
  .pwa-install-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    display: none;
  }

  .pwa-install-btn:hover {
    background: #e04a4a;
  }

  .pwa-update-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3b82f6;
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 300px;
  }

  .pwa-update-notification button {
    margin-left: 8px;
    background: white;
    color: #3b82f6;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
  }

  .pwa-status {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    z-index: 1000;
    font-size: 14px;
  }

  .site-header {
    position: relative;
  }
`;

// Inject PWA styles
const styleSheet = document.createElement('style');
styleSheet.textContent = pwaStyles;
document.head.appendChild(styleSheet);
