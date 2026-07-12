// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Add js-enabled class to body
    document.body.classList.add('js-enabled');
    
    // ===== MOBILE FALLBACK: Content ko visible karein =====
    if (window.innerWidth <= 768) {
        setTimeout(function() {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(function(el) {
                el.classList.add('active');
            });
        }, 300);
    }
    
    // ===== READING PROGRESS BAR =====
    const progressBar = document.getElementById('readingProgress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // ===== SCROLL REVEAL ANIMATION =====
    const reveals = document.querySelectorAll('.reveal');
    
    try {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });
        
        reveals.forEach(el => revealObserver.observe(el));
    } catch (error) {
        // Fallback: saare elements visible kar dein
        reveals.forEach(el => el.classList.add('active'));
    }
    
    // ===== BACK TO TOP BUTTON =====
    const backBtn = document.getElementById('backToTop');
    
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backBtn.style.display = 'flex';
                backBtn.style.opacity = '1';
            } else {
                backBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY <= 400) {
                        backBtn.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        backBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ===== MOBILE MENU WITH OVERLAY =====
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (menuBtn && navMenu) {
        // Create overlay if not exists
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }
        
        // Toggle menu
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            overlay.classList.toggle('active');
            menuBtn.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
            
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            navMenu.classList.remove('open');
            overlay.classList.remove('active');
            menuBtn.textContent = '☰';
            document.body.style.overflow = '';
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                overlay.classList.remove('active');
                menuBtn.textContent = '☰';
                document.body.style.overflow = '';
            }
        });
        
        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                overlay.classList.remove('active');
                menuBtn.textContent = '☰';
                document.body.style.overflow = '';
            });
        });
    }
    
    // ===== DARK MODE TOGGLE =====
    const darkModeBtn = document.getElementById('darkModeBtn');
    const body = document.body;
    
    if (darkModeBtn) {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            body.classList.add('dark-mode');
            darkModeBtn.textContent = '☀️';
        } else {
            darkModeBtn.textContent = '🌙';
        }
        
        darkModeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            darkModeBtn.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'theme_change', {
                    'event_category': 'engagement',
                    'event_label': isDark ? 'dark' : 'light'
                });
            }
        });
        
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        body.classList.add('dark-mode');
                        darkModeBtn.textContent = '☀️';
                    } else {
                        body.classList.remove('dark-mode');
                        darkModeBtn.textContent = '🌙';
                    }
                }
            });
        }
    }
    
    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const suffix = entry.target.dataset.suffix || '';
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                let step = 0;
                
                const timer = setInterval(() => {
                    step++;
                    current = Math.min(Math.round(increment * step), target);
                    entry.target.textContent = current + suffix;
                    
                    if (step >= steps) {
                        entry.target.textContent = target + suffix;
                        clearInterval(timer);
                    }
                }, duration / steps);
                
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(el => counterObserver.observe(el));
    
    // ===== FAQ TOGGLE =====
    window.toggleFAQ = function(el) {
        el.classList.toggle('active');
    };
    
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
    });
    
    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    
    if (searchInput) {
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        const handleSearch = debounce((query) => {
            query = query.toLowerCase().trim();
            const cards = document.querySelectorAll('.article-card');
            let visibleCount = 0;
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.article-category')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(query) || desc.includes(query) || category.includes(query);
                
                if (matches) {
                    card.style.display = 'block';
                    if (query) {
                        card.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            card.style.transform = '';
                        }, 300);
                    }
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (noResults) {
                noResults.style.display = visibleCount === 0 && query ? 'block' : 'none';
            }
            
            if (query && typeof gtag !== 'undefined') {
                gtag('event', 'search', {
                    'event_category': 'engagement',
                    'event_label': query,
                    'value': visibleCount
                });
            }
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // ===== SHARE BUTTONS =====
    window.shareWhatsApp = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://wa.me/?text=${title}%20${url}`, '_blank', 'width=600,height=600');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'whatsapp',
                'content_type': 'article',
                'item_id': window.location.pathname
            });
        }
    };
    
    window.shareFacebook = function() {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'facebook',
                'content_type': 'article',
                'item_id': window.location.pathname
            });
        }
    };
    
    window.shareTwitter = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'twitter',
                'content_type': 'article',
                'item_id': window.location.pathname
            });
        }
    };
    
    window.copyLink = function() {
        const url = window.location.href;
        
        navigator.clipboard.writeText(url).then(() => {
            const msg = document.getElementById('copiedMsg');
            if (msg) {
                msg.classList.add('show');
                setTimeout(() => {
                    msg.classList.remove('show');
                }, 3000);
            }
            
            const btn = document.querySelector('.share-btn.copy');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Copied!';
                btn.style.background = '#10b981';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': 'copy_link',
                'content_type': 'article',
                'item_id': window.location.pathname
            });
        }
    };
    
    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load', {
                'event_category': 'performance',
                'event_label': `${Math.round(loadTime)}ms`,
                'value': Math.round(loadTime)
            });
        }
        
        if (loadTime > 3000) {
            console.warn('⚠️ Page load time is slow (>3s)');
        }
    });
    
    let maxScroll = 0;
    let scrollTracked = { 25: false, 50: false, 75: false, 100: false };
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            [25, 50, 75, 100].forEach(threshold => {
                if (scrollPercent >= threshold && !scrollTracked[threshold]) {
                    scrollTracked[threshold] = true;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'event_category': 'engagement',
                            'event_label': `${threshold}%`,
                            'value': threshold
                        });
                    }
                }
            });
        }
    });
    
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error.toString(),
                'fatal': false
            });
        }
    });
});

// ===== LAZY LOADING =====
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        console.log('✅ Native lazy loading supported');
    } else {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// ===== CONSOLE EASTER EGG =====
console.log('%c🕌 NurulBayt', 'font-size: 24px; font-weight: bold; color: #d4af37;');
console.log('%cPremium Islamic Parenting Resource', 'font-size: 14px; color: #0c2d25;');
console.log('%cMade with ❤️ for Muslim families worldwide', 'font-size: 12px; color: #666;');
