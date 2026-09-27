document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileClose = document.getElementById('mobile-close');

    if (hamburger && mobileOverlay && mobileClose) {
        hamburger.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        mobileClose.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) {
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Filter Dropdown Interaction
    const filterItems = document.querySelectorAll('.filter-item:not(.sort-item)');
    const activeFiltersContainer = document.getElementById('active-filters');
    
    function updateFilterValueText(selectElement) {
        const filterItem = selectElement.closest('.filter-item');
        const valueSpan = filterItem.querySelector('.filter-value');
        if (valueSpan) {
            const selectedText = selectElement.options[selectElement.selectedIndex].text;
            valueSpan.textContent = selectedText;
        }
    }

    // Initialize custom dropdowns for all filters
    document.querySelectorAll('.filter-item').forEach(item => {
        const select = item.querySelector('select');
        if (!select) return;

        // Ensure original select is initialized properly
        updateFilterValueText(select);

        // Create custom dropdown container
        const dropdownList = document.createElement('div');
        dropdownList.className = 'custom-dropdown-list';
        
        // Populate options based on the select element
        Array.from(select.options).forEach((opt, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-dropdown-option';
            optionDiv.textContent = opt.text;
            if (index === select.selectedIndex) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                // Update select element
                select.selectedIndex = index;
                
                // Update active state on options
                dropdownList.querySelectorAll('.custom-dropdown-option').forEach(el => el.classList.remove('selected'));
                optionDiv.classList.add('selected');
                
                // Close dropdown
                item.classList.remove('dropdown-open');
                
                // Dispatch change event to trigger existing logic
                select.dispatchEvent(new Event('change'));
            });
            dropdownList.appendChild(optionDiv);
        });

        item.appendChild(dropdownList);

        // Toggle dropdown on filter item click
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.filter-item.dropdown-open').forEach(other => {
                if (other !== item) other.classList.remove('dropdown-open');
            });
            item.classList.toggle('dropdown-open');
        });

        // Handle logical change event (e.g., from 'Xóa tất cả' or clicking tags)
        select.addEventListener('change', function() {
            updateFilterValueText(this);
            // Sync custom dropdown option states
            const customOptions = dropdownList.querySelectorAll('.custom-dropdown-option');
            customOptions.forEach((opt, idx) => {
                if (idx === this.selectedIndex) opt.classList.add('selected');
                else opt.classList.remove('selected');
            });

            if (!this.closest('.sort-item')) {
                renderActiveFilters();
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.filter-item.dropdown-open').forEach(item => {
            item.classList.remove('dropdown-open');
        });
    });

    // 3. Brand Tab Click
    const brandTabs = document.querySelectorAll('.brand-tab');
    
    brandTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            brandTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');
            
            const targetId = this.getAttribute('data-target');
            
            if (targetId === 'all') {
                // Scroll to top of products or show all (in this layout, we just scroll to first section)
                const firstSection = document.querySelector('.brand-section');
                if (firstSection) {
                    firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Calculate header height to offset scroll
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4 & 5. Filter Tag Generation, Remove & Clear All
    function renderActiveFilters() {
        if (!activeFiltersContainer) return;
        
        // Find all active filters (where selected index > 0)
        const activeSelects = Array.from(filterItems)
            .map(item => item.querySelector('select'))
            .filter(select => select && select.selectedIndex > 0);
        
        if (activeSelects.length === 0) {
            activeFiltersContainer.style.display = 'none';
            return;
        }
        
        activeFiltersContainer.style.display = 'flex';
        
        const labelHTML = '<span class="filter-label">Bộ lọc đang chọn:</span>';
        let tagsHTML = '';
        
        activeSelects.forEach((select, index) => {
            const text = select.options[select.selectedIndex].text;
            const selectId = `filter-select-${index}`;
            select.dataset.filterId = selectId; 
            tagsHTML += `
                <div class="filter-tag">
                    <span>${text}</span>
                    <button class="remove-tag" data-target-id="${selectId}"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        });
        
        const clearBtnHTML = '<a href="#" class="clear-filters" id="clear-filters">Xóa tất cả</a>';
        activeFiltersContainer.innerHTML = labelHTML + tagsHTML + clearBtnHTML;
        
        // Bind events to new remove buttons
        const removeBtns = activeFiltersContainer.querySelectorAll('.remove-tag');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target-id');
                const targetSelect = document.querySelector(`select[data-filter-id="${targetId}"]`);
                if (targetSelect) {
                    targetSelect.selectedIndex = 0;
                    updateFilterValueText(targetSelect);
                    renderActiveFilters();
                }
            });
        });
        
        // Bind clear all
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function(e) {
                e.preventDefault();
                activeSelects.forEach(select => {
                    select.selectedIndex = 0;
                    updateFilterValueText(select);
                });
                renderActiveFilters();
            });
        }
    }
    
    // Initial render
    renderActiveFilters();

    // 6. Back to Top Button
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

    // 7. Product Wishlist Toggle
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    });

    // 8. Sticky Header Shadow on Scroll
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
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