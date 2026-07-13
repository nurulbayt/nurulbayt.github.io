/**
 * NURULBAYT - PROFESSIONAL JAVASCRIPT
 * Version: 2.0 (Production Ready)
 * Last Updated: July 2026
 */

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollToTop();
    initReadingProgress();
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initDarkMode();
    initCounters();
    initFAQ();
    initSearch();
    initSmoothScroll();
    initShareButtons();
    initPerformanceMonitoring();
    
    // Scroll to top on page load
    setTimeout(() => window.scrollTo(0, 0), 100);
});

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const backBtn = document.getElementById('backToTop');
    if (!backBtn) return;
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
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
                ticking = false;
            });
            ticking = true;
        }
    });
    
    backBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== READING PROGRESS BAR =====
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                progressBar.style.width = scrolled + '%';
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    
    try {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });
        
        reveals.forEach(el => revealObserver.observe(el));
    } catch (error) {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
    }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    if (!menuBtn || !navMenu) return;
    
    // Create overlay
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    function toggleMenu() {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        overlay.classList.toggle('active');
        menuBtn.textContent = isOpen ? '☰' : '✕';
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }
    
    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu();
        }
    });
    
    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// ===== DARK MODE =====
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const body = document.body;
    if (!darkModeBtn) return;
    
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
        darkModeBtn.textContent = '️';
    } else {
        darkModeBtn.textContent = '🌙';
    }
    
    darkModeBtn.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        darkModeBtn.textContent = isDark ? '️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'event_category': 'engagement',
                'event_label': isDark ? 'dark' : 'light'
            });
        }
    });
    
    // Listen for system changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
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
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const suffix = entry.target.dataset.suffix || '';
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let step = 0;
                
                const timer = setInterval(function() {
                    step++;
                    const current = Math.min(Math.round(increment * step), target);
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
}

// ===== FAQ TOGGLE =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(function(item) {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    if (!searchInput) return;
    
    const debounce = function(func, wait) {
        let timeout;
        return function executedFunction() {
            const args = arguments;
            const later = function() {
                clearTimeout(timeout);
                func.apply(null, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    const handleSearch = debounce(function(query) {
        query = query.toLowerCase().trim();
        const cards = document.querySelectorAll('.article-card');
        let visibleCount = 0;
        
        cards.forEach(function(card) {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.article-category') ? 
                card.querySelector('.article-category').textContent.toLowerCase() : '';
            
            const matches = title.includes(query) || desc.includes(query) || category.includes(query);
            
            if (matches) {
                card.style.display = 'block';
                if (query) {
                    card.style.transform = 'scale(1.02)';
                    setTimeout(() => card.style.transform = '', 300);
                }
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (noResults) {
            noResults.style.display = visibleCount === 0 && query ? 'block' : 'none';
        }
        
        // Track search
        if (query && typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                'event_category': 'engagement',
                'event_label': query,
                'value': visibleCount
            });
        }
    }, 300);
    
    searchInput.addEventListener('input', function(e) {
        handleSearch(e.target.value);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ===== SHARE BUTTONS =====
function initShareButtons() {
    // WhatsApp
    const whatsappBtn = document.querySelector('.share-btn.whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            window.open('https://wa.me/?text=' + title + '%20' + url, '_blank', 'width=600,height=600');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'whatsapp',
                    'content_type': 'article',
                    'item_id': window.location.pathname
                });
            }
        });
    }
    
    // Facebook
    const facebookBtn = document.querySelector('.share-btn.facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'facebook',
                    'content_type': 'article',
                    'item_id': window.location.pathname
                });
            }
        });
    }
    
    // Twitter
    const twitterBtn = document.querySelector('.share-btn.twitter');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + title, '_blank', 'width=600,height=400');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'twitter',
                    'content_type': 'article',
                    'item_id': window.location.pathname
                });
            }
        });
    }
    
    // Copy Link
    const copyBtn = document.querySelector('.share-btn.copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', async function() {
            const url = window.location.href;
            const msg = document.getElementById('copiedMsg');
            
            try {
                await navigator.clipboard.writeText(url);
                if (msg) {
                    msg.classList.add('show');
                    setTimeout(() => msg.classList.remove('show'), 3000);
                }
                
                const originalText = this.innerHTML;
                this.innerHTML = '✅ Copied!';
                this.style.background = '#10b981';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                }, 2000);
                
            } catch (err) {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': 'copy_link',
                    'content_type': 'article',
                    'item_id': window.location.pathname
                });
            }
        });
    }
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log('🚀 Page loaded in ' + Math.round(loadTime) + 'ms');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load', {
                'event_category': 'performance',
                'event_label': Math.round(loadTime) + 'ms',
                'value': Math.round(loadTime)
            });
        }
        
        if (loadTime > 3000) {
            console.warn('⚠️ Page load time is slow (>3s)');
        }
    });
    
    // Scroll depth tracking
    let maxScroll = 0;
    let scrollTracked = { 25: false, 50: false, 75: false, 100: false };
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / 
            (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            [25, 50, 75, 100].forEach(function(threshold) {
                if (scrollPercent >= threshold && !scrollTracked[threshold]) {
                    scrollTracked[threshold] = true;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'event_category': 'engagement',
                            'event_label': threshold + '%',
                            'value': threshold
                        });
                    }
                }
            });
        }
    });
    
    // Error tracking
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error.toString(),
                'fatal': false
            });
        }
    });
}

// ===== CONSOLE EASTER EGG =====
console.log('%c🕌 NurulBayt', 'font-size: 24px; font-weight: bold; color: #d4af37;');
console.log('%cPremium Islamic Parenting Resource', 'font-size: 14px; color: #0c2d25;');
console.log('%cMade with ❤️ for Muslim families worldwide', 'font-size: 12px; color: #666;');
