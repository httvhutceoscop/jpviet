// Sidebar Menu Component
class SidebarMenu {
  constructor() {
    this.isOpen = false;
    this.sidebar = null;
    this.overlay = null;
    this.menuToggle = null;
    this.init();
  }

  init() {
    this.createSidebar();
    this.createOverlay();
    this.createMenuToggle();
    this.bindEvents();
    this.setupResponsive();
  }

  createSidebar() {
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'sidebar';
    this.sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-icon">🇯🇵</span>
          <span class="logo-text">JPVIET</span>
        </div>
        <button class="sidebar-close" aria-label="Đóng menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-title">🎯 JLPT</h3>
          <a href="jlpt.html" class="nav-link">
            <span class="nav-icon">📊</span>
            <span class="nav-text">Tổng quan JLPT</span>
          </a>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">📚 Học tập</h3>
          <a href="vocab.html" class="nav-link">
            <span class="nav-icon">📖</span>
            <span class="nav-text">Từ vựng</span>
          </a>
          <a href="grammar.html" class="nav-link">
            <span class="nav-icon">📝</span>
            <span class="nav-text">Ngữ pháp</span>
          </a>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">🃏 Luyện tập</h3>
          <a href="flashcard.html" class="nav-link">
            <span class="nav-icon">🃏</span>
            <span class="nav-text">Flashcard</span>
          </a>
          <a href="quiz.html" class="nav-link">
            <span class="nav-icon">📝</span>
            <span class="nav-text">Quiz</span>
          </a>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">⚙️ Cài đặt</h3>
          <button class="nav-link" id="pwa-install-btn">
            <span class="nav-icon">📱</span>
            <span class="nav-text">Cài đặt App</span>
          </button>
          <button class="nav-link" id="clear-progress-btn">
            <span class="nav-icon">🔄</span>
            <span class="nav-text">Reset tiến độ</span>
          </button>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-progress">
          <div class="progress-item">
            <span class="progress-label">Từ vựng đã học</span>
            <span class="progress-value" id="sidebar-vocab-count">0</span>
          </div>
          <div class="progress-item">
            <span class="progress-label">Ngữ pháp đã học</span>
            <span class="progress-value" id="sidebar-grammar-count">0</span>
          </div>
        </div>
        <div class="sidebar-version">
          <small>v1.0.0</small>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.sidebar);
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    document.body.appendChild(this.overlay);
  }

  createMenuToggle() {
    this.menuToggle = document.createElement('button');
    this.menuToggle.className = 'menu-toggle';
    this.menuToggle.setAttribute('aria-label', 'Mở menu');
    this.menuToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `;
    
    // Insert after header
    const header = document.querySelector('.site-header');
    if (header) {
      header.appendChild(this.menuToggle);
    }
  }

  bindEvents() {
    // Menu toggle
    this.menuToggle.addEventListener('click', () => this.toggle());
    
    // Close button
    const closeBtn = this.sidebar.querySelector('.sidebar-close');
    closeBtn.addEventListener('click', () => this.close());
    
    // Overlay click
    this.overlay.addEventListener('click', () => this.close());
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // PWA install button
    const pwaInstallBtn = this.sidebar.querySelector('#pwa-install-btn');
    pwaInstallBtn.addEventListener('click', () => {
      if (window.pwaManager && window.pwaManager.deferredPrompt) {
        window.pwaManager.installApp();
      } else {
        alert('Ứng dụng đã được cài đặt hoặc không hỗ trợ cài đặt PWA');
      }
    });
    
    // Clear progress button
    const clearProgressBtn = this.sidebar.querySelector('#clear-progress-btn');
    clearProgressBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn xóa toàn bộ tiến độ học tập?')) {
        this.clearProgress();
      }
    });
    
    // Active link highlighting
    this.highlightActiveLink();
  }

  setupResponsive() {
    // Close sidebar on window resize if mobile
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    document.body.classList.add('sidebar-open');
    this.sidebar.classList.add('open');
    this.overlay.classList.add('open');
    this.menuToggle.classList.add('active');
    
    // Update progress counts
    this.updateProgressCounts();
    
    // Focus management
    this.sidebar.focus();
    
    // Prevent body scroll on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    this.isOpen = false;
    document.body.classList.remove('sidebar-open');
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('open');
    this.menuToggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Focus back to toggle button
    this.menuToggle.focus();
  }

  highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = this.sidebar.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      if (link.href && link.href.includes(currentPath)) {
        link.classList.add('active');
      }
    });
  }

  updateProgressCounts() {
    // Get vocab count from localStorage or default
    const vocabCount = localStorage.getItem('jpviet_vocab_known') || '0';
    const grammarCount = localStorage.getItem('jpviet_grammar_known') || '0';
    
    document.getElementById('sidebar-vocab-count').textContent = vocabCount;
    document.getElementById('sidebar-grammar-count').textContent = grammarCount;
  }

  clearProgress() {
    // Clear all localStorage items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('jpviet_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Update counts
    this.updateProgressCounts();
    
    // Show success message
    this.showMessage('Đã xóa tiến độ học tập!', 'success');
    
    // Reload page to reset all progress
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `sidebar-message ${type}`;
    messageEl.textContent = message;
    
    this.sidebar.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.sidebarMenu = new SidebarMenu();
});
