document.addEventListener('DOMContentLoaded', function() {

  // 1. Reading Progress Bar
  const progressBar = document.getElementById('reading-progress');
  window.addEventListener('scroll', updateProgress);
  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // 2. Sticky Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // 3. Back to Top
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 4. Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-close');
  if (hamburger) hamburger.addEventListener('click', () => overlay.classList.add('active'));
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });

  // 5. TOC: smooth scroll + active highlight
  const tocLinks = document.querySelectorAll('.toc-list a');
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
               top: offsetPosition,
               behavior: "smooth"
          });
      }
    });
  });

  // TOC active state on scroll
  const sections = document.querySelectorAll('.article-section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
    });
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // 6. FAQ toggle (expand/collapse)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (q && a) {
      // Start with answers hidden initially from CSS but allow toggle
      q.style.cursor = 'pointer';
      q.addEventListener('click', () => {
        const isHidden = window.getComputedStyle(a).display === 'none';
        a.style.display = isHidden ? 'block' : 'none';
      });
    }
  });

  // 7. Image Upload Preview for Widget 3 (Sidebar)
  const uploadInput = document.getElementById('uploadInput');
  const uploadPreview = document.getElementById('uploadPreview');
  
  if (uploadInput && uploadPreview) {
    uploadInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          uploadPreview.src = e.target.result;
          uploadPreview.classList.remove('opacity-0');
          uploadPreview.classList.add('opacity-100');
        }
        reader.readAsDataURL(file);
      }
    });
  }

  // 8. Image Upload Preview for Bottom CTA
  const bottomUploadInput = document.getElementById('bottomUploadInput');
  const bottomUploadPreview = document.getElementById('bottomUploadPreview');
  
  if (bottomUploadInput && bottomUploadPreview) {
    bottomUploadInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          bottomUploadPreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
  }

});

// --- UPLOAD IMAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const globalImageUpload = document.getElementById('globalImageUpload');
    if (globalImageUpload) {
        // Find all triggers
        const uploadTriggers = document.querySelectorAll('.sidebar-upload, .upload-cloud-icon, .btn-upload, [id^="btn-thu-ngay"]');
        
        uploadTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                globalImageUpload.click();
            });
            trigger.style.cursor = 'pointer';
        });

        globalImageUpload.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                alert('�? ch?n file: ' + e.target.files[0].name + '. Logic x? l? ?nh ti?p theo s? ? ��y.');
            }
        });
    }

    // --- FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent default if it's not a details summary standard behavior, or toggle classes
            // Assuming HTML5 <details> tag is used, the browser handles open/close natively.
            // If custom divs are used:
            if(item.tagName !== 'DETAILS') {
                item.classList.toggle('active');
            }
        });
    });
// --- L�M CLICK ��?C T?T C? S? �I?N THO?I V� EMAIL TR�N TRANG ---
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
    
    // �?m b?o con tr? th�nh b�n tay khi l�?t qua s? �i?n tho?i/email
    const style = document.createElement('style');
    style.innerHTML = '.auto-link:hover { opacity: 0.8; text-decoration: underline !important; cursor: pointer; }';
    document.head.appendChild(style);
});
});

