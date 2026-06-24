// ===== LOADER =====
window.addEventListener("load", function () {
    setTimeout(function () {
        const loader = document.getElementById("loader");
        if (loader) loader.classList.add("hidden");
    }, 1200);
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target); // Once revealed, stop observing
        }
    });
}, { threshold: 0.1 }); // FIX: 0.12 → 0.1 for better trigger timing
reveals.forEach(el => revealObserver.observe(el));

// ===== BACK TO TOP =====
const backBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    if (!backBtn) return;
    backBtn.style.display = window.scrollY > 400 ? "flex" : "none";
}, { passive: true });

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

// ===== MOBILE MENU =====
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
if (menuBtn && navMenu) {
    // FIX: Support both click and keyboard (Enter/Space) for accessibility
    function toggleMenu() {
        const isOpen = navMenu.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", isOpen);
        menuBtn.textContent = isOpen ? "✕" : "☰";
    }
    menuBtn.addEventListener("click", toggleMenu);
    menuBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when a nav link is clicked (mobile UX improvement)
    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.textContent = "☰";
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.textContent = "☰";
        }
    });
}

// ===== FAQ =====
function toggleFAQ(el) {
    // Close all others first
    document.querySelectorAll(".faq-item.active").forEach(item => {
        if (item !== el) {
            item.classList.remove("active");
            item.setAttribute("aria-expanded", "false");
        }
    });
    // Toggle current
    const isActive = el.classList.toggle("active");
    el.setAttribute("aria-expanded", isActive);
}

// FIX: FAQ keyboard support
document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFAQ(item);
        }
    });
});

// ===== COUNTER =====
// FIX 1: Uses data-suffix for proper %, +, /7 display
// FIX 2: threshold lowered to 0.15 so counters trigger before being half-hidden
// FIX 3: Starts from displayed static value so no flash of "0"
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || "";
            let current = 0;
            const duration = 1400; // ms
            const steps = 55;
            const increment = Math.ceil(target / steps);
            const interval = Math.floor(duration / steps);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    el.textContent = current + suffix;
                }
            }, interval);

            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.15 }); // FIX: was 0.5 — too high, caused counters to show 0

counters.forEach(el => counterObserver.observe(el));

// ===== DARK MODE =====
// FIX: Apply to <html> element to prevent flash of wrong theme
// (The localStorage check in <head> already adds the class to html on load)
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark-mode");
    document.body.classList.toggle("dark-mode", isDark); // keep body in sync for legacy CSS
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Sync button icon on page load
(function () {
    const isDark = document.documentElement.classList.contains("dark-mode");
    if (isDark) {
        document.body.classList.add("dark-mode");
        const btn = document.getElementById("darkModeBtn");
        if (btn) btn.textContent = "☀️";
    }
})();

// ===== SEARCH FUNCTION =====
// FIX: Uses display:"" instead of "block" to preserve grid layout
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

if (searchInput) {
    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".article-card");
        let visibleCount = 0;

        cards.forEach(card => {
            const titleEl = card.querySelector("h3");
            const descEl = card.querySelector("p");
            const catEl = card.querySelector(".article-category");

            const title = titleEl ? titleEl.textContent.toLowerCase() : "";
            const desc = descEl ? descEl.textContent.toLowerCase() : "";
            const cat = catEl ? catEl.textContent.toLowerCase() : "";

            const matches = !query || title.includes(query) || desc.includes(query) || cat.includes(query);

            // FIX: Use "" not "block" — preserves CSS grid display
            card.style.display = matches ? "" : "none";
            if (matches) visibleCount++;
        });

        // Show "no results" message if nothing matches
        if (noResults) {
            noResults.style.display = (query && visibleCount === 0) ? "block" : "none";
        }
    });
}

// ===== NEWSLETTER FORM FEEDBACK =====
function handleNewsletter(e) {
    const form = e.target;
    const btn = form.querySelector("button[type='submit']");

    // Only intercept if Formspree ID not yet replaced
    if (form.action.includes("YOUR_FORM_ID")) {
        e.preventDefault();
        if (btn) {
            btn.textContent = "⚠️ Setup needed";
            btn.style.opacity = ".7";
            setTimeout(() => {
                btn.textContent = "Subscribe";
                btn.style.opacity = "1";
            }, 3000);
        }
        console.warn("NurulBayt: Replace YOUR_FORM_ID in index.html with your real Formspree ID.");
        return;
    }

    // Real submission feedback
    if (btn) {
        btn.textContent = "Sending...";
        btn.disabled = true;
    }
        }
