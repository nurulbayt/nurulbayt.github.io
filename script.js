// ===== LOADER =====
window.addEventListener("load", function() {
    setTimeout(function() {
        document.getElementById("loader").classList.add("hidden");
    }, 1200);
});

// ===== READING PROGRESS BAR =====
const progressBar = document.createElement("div");
progressBar.className = "reading-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + "%";
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// ===== BACK TO TOP =====
const backBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backBtn.style.display = "flex";
    } else {
        backBtn.style.display = "none";
    }
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
});

// ===== MOBILE MENU WITH OVERLAY =====
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

// Create overlay
const overlay = document.createElement("div");
overlay.className = "nav-overlay";
document.body.appendChild(overlay);

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    overlay.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
});

// Close on overlay click
overlay.addEventListener("click", () => {
    navMenu.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
});

// Close on escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }
});

// Close on link click
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    });
});

// ===== FAQ TOGGLE =====
function toggleFAQ(el) {
    el.classList.toggle("active");
}

// ===== ARTICLE FAQ TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.article-faq .faq-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});

// ===== COUNTER =====
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            const suffix = entry.target.dataset.suffix || "";
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

// ===== DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("darkModeBtn");
    const isDark = document.body.classList.contains("dark-mode");
    
    btn.textContent = isDark ? "☀️" : "";
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    // Track in analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
            'event_category': 'engagement',
            'event_label': isDark ? 'dark' : 'light'
        });
    }
}

// Initialize dark mode with system preference
function initDarkMode() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeBtn").textContent = "☀️";
    }
}

initDarkMode();

// ===== DEBOUNCE FUNCTION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== SEARCH FUNCTION WITH DEBOUNCE =====
const searchInput = document.getElementById("searchInput");
const handleSearch = debounce(function(query) {
    query = query.toLowerCase();
    const cards = document.querySelectorAll(".article-card");
    let visibleCount = 0;
    
    cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const desc = card.querySelector("p").textContent.toLowerCase();
        const category = card.querySelector(".article-category").textContent.toLowerCase();
        
        const matches = title.includes(query) || desc.includes(query) || category.includes(query);
        card.style.display = matches ? "block" : "none";
        if (matches) visibleCount++;
    });
    
    // Show/hide no results message
    const noResults = document.getElementById("noResults");
    if (noResults) {
        noResults.style.display = visibleCount === 0 && query ? "block" : "none";
    }
}, 300);

if (searchInput) {
    searchInput.addEventListener("input", function() {
        handleSearch(this.value);
    });
}

// ===== SHARE FUNCTIONS =====
function shareWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'method': 'whatsapp',
            'content_type': 'article'
        });
    }
}

function shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'method': 'facebook',
            'content_type': 'article'
        });
    }
}

function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'method': 'twitter',
            'content_type': 'article'
        });
    }
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const msg = document.getElementById('copiedMsg');
        if (msg) {
            msg.classList.add('show');
            setTimeout(() => msg.classList.remove('show'), 3000);
        }
    });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'method': 'copy_link',
            'content_type': 'article'
        });
    }
}

// ===== PERFORMANCE TRACKING =====
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load', {
            'event_category': 'performance',
            'event_label': `${Math.round(loadTime)}ms`
        });
    }
});

// ===== TRACK SCROLL DEPTH =====
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(maxScroll)) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    'event_category': 'engagement',
                    'event_label': `${maxScroll}%`
                });
            }
        }
    }
});
