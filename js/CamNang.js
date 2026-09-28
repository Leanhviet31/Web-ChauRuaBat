document.addEventListener('DOMContentLoaded', function() {

  // 1. Category Tab Click
  const catTabs = document.querySelectorAll('.cat-tab');
  catTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      catTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      // Placeholder filter effect
    });
  });

  // 2. Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-close');
  if (hamburger && overlay && closeBtn) {
    hamburger.addEventListener('click', () => overlay.classList.add('active'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  }

  // 3. Sticky Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  });

  // 4. Back to Top
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { backToTop.classList.add('show'); }
    else { backToTop.classList.remove('show'); }
  });
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // 5. Email Subscribe
  const emailSubmit = document.getElementById('email-submit');
  const emailInput = document.getElementById('email-input');
  if (emailSubmit && emailInput) {
    emailSubmit.addEventListener('click', () => {
      const val = emailInput.value.trim();
      if (val && val.includes('@')) {
        showToast('Đăng ký thành công! Cảm ơn bạn.');
        emailInput.value = '';
      } else {
        showToast('Vui lòng nhập email hợp lệ.');
      }
    });
  }

  // 6. Pagination
  const pageBtns = document.querySelectorAll('.page-btn:not(.page-next)');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      pageBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 7. Toast helper
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'crb-toast';
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;z-index:9999;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

});
// --- LÀM CLICK ĐƯỢC TẤT CẢ SỐ ĐIỆN THOẠI VÀ EMAIL TRÊN TRANG ---
document.addEventListener('DOMContentLoaded', () => {
    const phoneRegex = /(0961\s*234\s*567|1900\s*1234|1900\s*6666|0961234567)/g;
    const emailRegex = /(info@crb\.vn)/gi;

    function wrapTextNodes(node) {
        if (['A', 'SCRIPT', 'STYLE', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(node.nodeName)) return;

        if (node.nodeType === 3) { // Text node
            let text = node.nodeValue;
            let replaced = false;

            if (phoneRegex.test(text)) {
                // Reset regex state
                phoneRegex.lastIndex = 0; 
                text = text.replace(phoneRegex, '<a href="tel:$1" class="auto-link" style="color: inherit; text-decoration: none;">$1</a>');
                // Clean up spaces in tel link
                text = text.replace(/href="tel:(.+?)"/g, function(match, p1) {
                    return 'href="tel:' + p1.replace(/\s+/g, '') + '"';
                });
                replaced = true;
            }

            if (emailRegex.test(text)) {
                emailRegex.lastIndex = 0;
                text = text.replace(emailRegex, '<a href="mailto:$1" class="auto-link" style="color: inherit; text-decoration: none;">$1</a>');
                replaced = true;
            }

            if (replaced) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text;
                node.replaceWith(...wrapper.childNodes);
            }
        } else {
            const children = Array.from(node.childNodes);
            for (let child of children) {
                wrapTextNodes(child);
            }
        }
    }

    wrapTextNodes(document.body);
    
    // Đảm bảo con trỏ thành bàn tay khi lướt qua số điện thoại/email
    const style = document.createElement('style');
    style.innerHTML = '.auto-link:hover { opacity: 0.8; text-decoration: underline !important; cursor: pointer; }';
    document.head.appendChild(style);
});
// ==============================================================
// STANDARDIZED MOBILE MENU LOGIC (ADDED BY AI)
// ==============================================================
document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileNavClose = document.getElementById('mobile-nav-close');

    function toggleMenu() {
        if (mainNav) mainNav.classList.toggle('menu-active');
        if (menuOverlay) menuOverlay.classList.toggle('menu-active');
    }

    function closeMenu() {
        if (mainNav) mainNav.classList.remove('menu-active');
        if (menuOverlay) menuOverlay.classList.remove('menu-active');
    }

    if (mobileMenuBtn) {
        // Remove old listeners by replacing node
        const newBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
        newBtn.addEventListener('click', toggleMenu);
    }
    
    if (mobileNavClose) {
        const newCloseBtn = mobileNavClose.cloneNode(true);
        mobileNavClose.parentNode.replaceChild(newCloseBtn, mobileNavClose);
        newCloseBtn.addEventListener('click', closeMenu);
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
});
