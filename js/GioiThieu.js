document.addEventListener('DOMContentLoaded', () => {
    // Back to top functionality
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    function toggleMenu() {
        navMenu.classList.toggle('active');
        if (menuOverlay) menuOverlay.classList.toggle('active');
    }

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    // Play video placeholder
    const playBtn = document.querySelector('.play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            alert('Video player modal would open here.');
        });
    }
});


    });
});
// --- LÀM TOÀN BỘ BOX CLICK ĐƯỢC (FULL BOX CLICK) ---
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card, .article-card, .post-card');
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Không trigger nếu click vào các nút chức năng khác
            if(e.target.closest('button') || e.target.closest('.btn-wishlist') || e.target.closest('.btn-outline')) return;
            
            // Tìm link chính
            let link = card.tagName.toUpperCase() === 'A' ? card : (card.querySelector('a.btn-detail') || card.querySelector('a'));
            if(link && link.href) {
                // Tránh vòng lặp click nếu click trực tiếp vào thẻ a con
                if(e.target.closest('a') === link && card.tagName.toUpperCase() !== 'A') return; 
                window.location.href = link.href;
            }
        });
    });
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