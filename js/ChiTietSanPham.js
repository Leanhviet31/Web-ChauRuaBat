document.addEventListener('DOMContentLoaded', () => {
    // 1. Image gallery (Advanced)
    const mainImageWrap = document.getElementById('main-image-wrap');
    const mainImage = document.getElementById('main-image');
    const thumbItems = document.querySelectorAll('.thumb-item');
    const mainPrev = document.getElementById('main-prev');
    const mainNext = document.getElementById('main-next');
    const thumbPrev = document.getElementById('thumb-prev');
    const thumbNext = document.getElementById('thumb-next');
    const thumbRow = document.getElementById('thumbnail-row');
    
    let currentIndex = 0;
    
    function updateGallery(index) {
        if(index < 0) index = thumbItems.length - 1;
        if(index >= thumbItems.length) index = 0;
        currentIndex = index;
        
        const selectedThumb = thumbItems[currentIndex];
        if (!selectedThumb) return;
        mainImage.src = selectedThumb.dataset.src;
        
        thumbItems.forEach(t => t.classList.remove('active'));
        selectedThumb.classList.add('active');
        
        if (thumbRow) {
            const scrollLeft = selectedThumb.offsetLeft - thumbRow.offsetLeft - (thumbRow.clientWidth / 2) + (selectedThumb.clientWidth / 2);
            thumbRow.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }
    
    thumbItems.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
            updateGallery(idx);
        });
    });
    
    if (mainPrev) mainPrev.addEventListener('click', () => updateGallery(currentIndex - 1));
    if (mainNext) mainNext.addEventListener('click', () => updateGallery(currentIndex + 1));
    
    if (thumbPrev) thumbPrev.addEventListener('click', () => { if (thumbRow) thumbRow.scrollBy({ left: -150, behavior: 'smooth' }); });
    if (thumbNext) thumbNext.addEventListener('click', () => { if (thumbRow) thumbRow.scrollBy({ left: 150, behavior: 'smooth' }); });
    
    // Zoom effect on PC
    if (mainImageWrap) {
        mainImageWrap.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Only apply on desktop
            const rect = mainImageWrap.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            mainImage.style.transformOrigin = `${x}% ${y}%`;
        });
        mainImageWrap.addEventListener('mouseleave', () => {
            mainImage.style.transformOrigin = 'center center';
        });
    }
    
    // Swipe on Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    if (mainImageWrap) {
        mainImageWrap.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        mainImageWrap.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }
    function handleSwipe() {
        if (touchEndX < touchStartX - 30) updateGallery(currentIndex + 1);
        if (touchEndX > touchStartX + 30) updateGallery(currentIndex - 1);
    }

    // 2. Quantity selector
    const qtyMinus = document.querySelector('.qty-minus');
    const qtyPlus = document.querySelector('.qty-plus');
    const qtyInput = document.querySelector('.qty-input');

    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        });

        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val < 99) {
                qtyInput.value = val + 1;
            }
        });
    }

    // 3. Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked button and target content
            btn.classList.add('active');
            const targetId = btn.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Toast Notification Function
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 4. Wishlist toggle
    const wishlistBtn = document.querySelector('.btn-wishlist-detail');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            wishlistBtn.classList.toggle('active');
            const icon = wishlistBtn.querySelector('i');
            if (wishlistBtn.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('Đã thêm vào yêu thích');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('Đã bỏ khỏi yêu thích');
            }
        });
    }

    // 5. Add to cart button
    const cartBtn = document.querySelector('.btn-cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            showToast('Đã thêm vào giỏ hàng');
        });
    }

    // 6. Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    // Create overlay for mobile menu
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    const header = document.querySelector('.header');
    if (header) {
        header.appendChild(menuOverlay);
    } else {
        document.body.appendChild(menuOverlay);
    }

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                mainNav.classList.add('open');
                menuOverlay.classList.add('open');
            }
        });
        
        // Close menu when clicking overlay or close button
        const closeMenu = () => {
            mainNav.classList.remove('open');
            menuOverlay.classList.remove('open');
        };

        menuOverlay.addEventListener('click', closeMenu);
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }
    }

    // Handle resize to reset mobile menu
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mainNav) {
            mainNav.classList.remove('open');
            menuOverlay.classList.remove('open');
        }
    });

    // 7. Sticky header is handled via CSS position: sticky

    // 8. Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 9. FitMatch logic
    const fitmatchBtn = document.querySelector('.btn-fitmatch-check');
    const fitmatchResults = document.querySelector('.fitmatch-results');

    if (fitmatchBtn && fitmatchResults) {
        fitmatchBtn.addEventListener('click', () => {
            // Simple logic to show results with a slight delay simulating check
            fitmatchBtn.textContent = 'Đang kiểm tra...';
            fitmatchBtn.disabled = true;
            fitmatchResults.style.display = 'none';
            
            setTimeout(() => {
                fitmatchResults.style.display = 'flex';
                fitmatchBtn.textContent = 'Kiểm tra';
                fitmatchBtn.disabled = false;
            }, 800);
        });
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