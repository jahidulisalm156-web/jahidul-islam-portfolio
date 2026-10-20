"use strict";

/* =========================================
   JAHIDUL ISLAM — PORTFOLIO WEBSITE
   Complete JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. SELECT HTML ELEMENTS
    ===================================== */

    const html = document.documentElement;
    const body = document.body;

    const header = document.querySelector(".site-header");

    const themeToggle = document.querySelector(".theme-toggle");
    const themeIcon = document.querySelector(".theme-icon");

    const languageToggle = document.querySelector(".language-toggle");

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navLinks = document.querySelectorAll(".nav-link");

    const backToTop = document.querySelector(".back-to-top");

    const filterButtons = document.querySelectorAll("[data-project-filter]");
    const projectCards = document.querySelectorAll("[data-project-category]");

    const currentYear = document.querySelector("#current-year");
    const themeColorMeta = document.querySelector("#theme-color-meta");


    /* =====================================
       2. SAFE LOCAL STORAGE HELPERS
    ===================================== */

    function getSavedValue(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function saveValue(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // The website can still work if storage is unavailable.
        }
    }


    /* =====================================
       3. DARK / LIGHT THEME
    ===================================== */

    function applyTheme(theme) {
        const selectedTheme = theme === "light" ? "light" : "dark";

        html.setAttribute("data-theme", selectedTheme);

        if (themeIcon) {
            themeIcon.textContent =
                selectedTheme === "dark" ? "☀" : "☾";
        }

        if (themeToggle) {
            const nextTheme =
                selectedTheme === "dark" ? "light" : "dark";

            themeToggle.setAttribute(
                "aria-label",
                nextTheme === "light"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );

            themeToggle.setAttribute(
                "title",
                nextTheme === "light"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                "content",
                selectedTheme === "dark" ? "#0b1020" : "#f7f8fc"
            );
        }

        saveValue("jahidul-portfolio-theme", selectedTheme);
    }

    const savedTheme = getSavedValue("jahidul-portfolio-theme");

    const initialTheme =
        savedTheme === "light" || savedTheme === "dark"
            ? savedTheme
            : html.getAttribute("data-theme") || "dark";

    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const currentTheme = html.getAttribute("data-theme");

            const newTheme =
                currentTheme === "dark" ? "light" : "dark";

            applyTheme(newTheme);
        });
    }


    /* =====================================
       4. LANGUAGE SWITCHER
    ===================================== */

    let currentLanguage =
        getSavedValue("jahidul-portfolio-language") || "en";

    if (currentLanguage !== "en" && currentLanguage !== "bn") {
        currentLanguage = "en";
    }

    function applyLanguage(language) {
        currentLanguage = language === "bn" ? "bn" : "en";

        html.setAttribute("lang", currentLanguage);

        /*
         * Update all elements that have data-en and data-bn.
         * Only text content changes; nested HTML elements are preserved.
         */
        const translatableElements = document.querySelectorAll(
            "[data-en][data-bn]"
        );

        translatableElements.forEach(function (element) {
            const translation =
                currentLanguage === "bn"
                    ? element.getAttribute("data-bn")
                    : element.getAttribute("data-en");

            if (translation !== null) {
                element.textContent = translation;
            }
        });

        if (languageToggle) {
            languageToggle.textContent =
                currentLanguage === "en" ? "বাংলা" : "English";

            languageToggle.setAttribute(
                "aria-label",
                currentLanguage === "en"
                    ? "Switch to Bengali"
                    : "Switch to English"
            );

            languageToggle.setAttribute(
                "title",
                currentLanguage === "en"
                    ? "Switch to Bengali"
                    : "Switch to English"
            );
        }

        saveValue("jahidul-portfolio-language", currentLanguage);
    }

    applyLanguage(currentLanguage);

    if (languageToggle) {
        languageToggle.addEventListener("click", function () {
            const newLanguage =
                currentLanguage === "en" ? "bn" : "en";

            applyLanguage(newLanguage);
        });
    }


    /* =====================================
       5. MOBILE NAVIGATION
    ===================================== */

    function openMenu() {
        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.add("open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        if (!mainNav || !menuToggle) {
            return;
        }

        mainNav.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu();
            });
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu = mainNav.contains(event.target);
            const clickedMenuButton = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedMenuButton) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 850) {
                closeMenu();
            }
        });
    }


    /* =====================================
       6. ACTIVE NAVIGATION LINK
    ===================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {
            const linkTarget = link.getAttribute("href");

            const isActive = linkTarget === "#" + sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window && sections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                const visibleEntries = entries
                    .filter(function (entry) {
                        return entry.isIntersecting;
                    })
                    .sort(function (a, b) {
                        return b.intersectionRatio - a.intersectionRatio;
                    });

                if (visibleEntries.length > 0) {
                    setActiveLink(visibleEntries[0].target.id);
                }
            },
            {
                root: null,
                rootMargin: "-20% 0px -60% 0px",
                threshold: [0, 0.1, 0.25, 0.5]
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }


    /* =====================================
       7. BACK TO TOP BUTTON
    ===================================== */

    function updateBackToTop() {
        if (!backToTop) {
            return;
        }

        if (window.scrollY > 350) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* =====================================
       8. PROJECT FILTER
    ===================================== */

    function filterProjects(category) {
        projectCards.forEach(function (card) {
            const cardCategory =
                card.getAttribute("data-project-category");

            const shouldShow =
                category === "all" || cardCategory === category;

            card.hidden = !shouldShow;
        });

        filterButtons.forEach(function (button) {
            const isActive =
                button.getAttribute("data-project-filter") === category;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const category =
                button.getAttribute("data-project-filter") || "all";

            filterProjects(category);
        });
    });

    filterProjects("all");


    /* =====================================
       9. CURRENT YEAR
    ===================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================
       10. HEADER SCROLL EFFECT
    ===================================== */

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================
       11. SMOOTH SCROLL FOR INTERNAL LINKS
    ===================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* =====================================
       12. REDUCE MOTION SUPPORT
    ===================================== */

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        html.classList.add("reduce-motion");
    }


    
/* =========================================
   PREMIUM UPGRADE — CSS ADD-ON
   পুরোনো CSS মুছবে না; একদম শেষে যোগ করবে
========================================= */

:root {
    --premium-glow-purple: rgba(124, 92, 255, 0.22);
    --premium-glow-cyan: rgba(0, 212, 255, 0.13);
}

/* 1. Animated ambient background */
body {
    position: relative;
    isolation: isolate;
}

body::before {
    content: "";
    position: fixed;
    inset: -25%;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(
            circle at 18% 25%,
            var(--premium-glow-purple),
            transparent 32%
        ),
        radial-gradient(
            circle at 82% 65%,
            var(--premium-glow-cyan),
            transparent 30%
        );
    background-size: 140% 140%;
    animation: premiumAmbient 18s ease-in-out infinite alternate;
    opacity: 0.8;
}

@keyframes premiumAmbient {
    0% {
        background-position: 0% 20%;
        transform: scale(1);
    }
    100% {
        background-position: 100% 80%;
        transform: scale(1.08);
    }
}

/* 2. Glassmorphism cards */
.about-card,
.skill-card,
.project-card,
.personal-details,
.floating-card,
.detail-item {
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
}

.about-card,
.skill-card,
.project-card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    border-color: rgba(155, 165, 220, 0.18);
    box-shadow:
        0 10px 35px rgba(0, 0, 0, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.035);
}

/* Subtle glow inside cards */
.about-card::after,
.skill-card::after,
.project-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(
        circle at 50% 0%,
        rgba(124, 92, 255, 0.16),
        transparent 65%
    );
    transition: opacity 350ms ease;
}

.about-card:hover::after,
.skill-card:hover::after,
.project-card:hover::after {
    opacity: 1;
}

/* 3. Premium project-card interactions */
.project-card {
    transform: translateY(0);
    transition:
        transform 350ms cubic-bezier(.2, .8, .2, 1),
        border-color 350ms ease,
        box-shadow 350ms ease;
}

.project-card:hover {
    transform: translateY(-8px);
    border-color: rgba(124, 92, 255, 0.65);
    box-shadow:
        0 18px 45px rgba(0, 0, 0, 0.20),
        0 0 25px rgba(124, 92, 255, 0.10);
}

.project-preview {
    transition: transform 400ms ease;
}

.project-card:hover .project-preview {
    transform: scale(1.025);
}

/* Keep project content above its decorative glow */
.project-content,
.project-preview {
    position: relative;
    z-index: 1;
}

/* 4. Animated gradient text */
.gradient-text {
    background-size: 200% auto;
    animation: premiumTextGradient 6s linear infinite;
}

@keyframes premiumTextGradient {
    0% {
        background-position: 0% center;
    }
    100% {
        background-position: 200% center;
    }
}

/* 5. Scroll reveal — starts only when JS activates it */
.js-ready .reveal-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition:
        opacity 650ms ease,
        transform 650ms cubic-bezier(.2, .8, .2, 1);
}

.js-ready .reveal-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Staggered appearance for cards */
.js-ready .about-card.reveal-on-scroll:nth-child(2),
.js-ready .skill-card.reveal-on-scroll:nth-child(2),
.js-ready .project-card.reveal-on-scroll:nth-child(2) {
    transition-delay: 80ms;
}

.js-ready .about-card.reveal-on-scroll:nth-child(3),
.js-ready .skill-card.reveal-on-scroll:nth-child(3),
.js-ready .project-card.reveal-on-scroll:nth-child(3) {
    transition-delay: 150ms;
}

/* 6. Typewriter cursor */
.typing-cursor::after {
    content: "";
    display: inline-block;
    width: 2px;
    height: 1em;
    margin-left: 5px;
    vertical-align: -0.12em;
    background: var(--accent-secondary, #00d4ff);
    animation: typingBlink 850ms steps(2, start) infinite;
}

@keyframes typingBlink {
    to {
        visibility: hidden;
    }
}

/* Respect users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
    body::before,
    .gradient-text,
    .typing-cursor::after {
        animation: none !important;
    }

    .js-ready .reveal-on-scroll,
    .js-ready .reveal-on-scroll.is-visible {
        opacity: 1;
        transform: none;
        transition: none;
    }

    .project-card,
    .project-preview {
        transition: none;
    }
}

/* On touch devices, avoid relying on hover effects */
@media (hover: none) {
    .project-card:hover {
        transform: none;
    }

    .project-card:hover .project-preview {
        transform: none;
    }
}
    wce

// =============================================
// PREMIUM PORTFOLIO UPGRADE
// Paste this entire block at the VERY END
// of js/script.js. Do not delete old code.
// =============================================

(function () {
    "use strict";

    function initPremiumPortfolio() {
        // Avoid running twice
        if (document.documentElement.dataset.premiumReady === "true") {
            return;
        }
        document.documentElement.dataset.premiumReady = "true";

        // 1. Scroll reveal animation
        const revealSelectors = [
            ".section-heading",
            ".about-card",
            ".personal-details",
            ".skill-card",
            ".project-card",
            ".intro-strip-inner"
        ];

        const revealElements = document.querySelectorAll(
            revealSelectors.join(",")
        );

        const reduceMotion = window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach(function (element) {
                element.classList.add("premium-reveal-visible");
            });
        } else {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("premium-reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: "0px 0px -25px 0px"
            });

            revealElements.forEach(function (element) {
                element.classList.add("premium-reveal");
                observer.observe(element);
            });
        }

        // 2. Typing effect for the existing hero subtitle
        const subtitle = document.querySelector(".hero-content h2");

        if (subtitle && !reduceMotion) {
            const phrases = {
                en: [
                    "Exploring AI, Programming & Software Development",
                    "Learning Technology Step by Step",
                    "Building Useful Digital Projects"
                ],
                bn: [
                    "AI, প্রোগ্রামিং ও সফটওয়্যার ডেভেলপমেন্ট শিখছি",
                    "ধাপে ধাপে প্রযুক্তি শিখছি",
                    "দরকারি ডিজিটাল প্রজেক্ট তৈরি করছি"
                ]
            };

            let phraseIndex = 0;
            let charIndex = 0;
            let deleting = false;
            let timer = null;

            function getLanguage() {
                return document.documentElement.lang === "bn" ? "bn" : "en";
            }

            function type() {
                const list = phrases[getLanguage()];
                const phrase = list[phraseIndex % list.length];

                if (!deleting) {
                    charIndex++;
                    subtitle.textContent = phrase.slice(0, charIndex);

                    if (charIndex >= phrase.length) {
                        deleting = true;
                        timer = setTimeout(type, 1600);
                        return;
                    }

                    timer = setTimeout(type, 45);
                } else {
                    charIndex--;
                    subtitle.textContent = phrase.slice(0, charIndex);

                    if (charIndex <= 0) {
                        deleting = false;
                        phraseIndex = (phraseIndex + 1) % list.length;
                        timer = setTimeout(type, 300);
                        return;
                    }

                    timer = setTimeout(type, 22);
                }
            }

            subtitle.classList.add("premium-typing-cursor");
            subtitle.textContent = "";
            type();

            // Restart typing in the selected language
            const langButton = document.querySelector(".language-toggle");

            if (langButton) {
                langButton.addEventListener("click", function () {
                    clearTimeout(timer);
                    phraseIndex = 0;
                    charIndex = 0;
                    deleting = false;
                    subtitle.textContent = "";
                    timer = setTimeout(type, 150);
                });
            }
        }

        // 3. Premium hover effects for project cards
        document.querySelectorAll(".project-card").forEach(function (card) {
            card.addEventListener("pointermove", function (event) {
                if (event.pointerType === "touch") return;

                const rect = card.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty("--pointer-x", x + "%");
                card.style.setProperty("--pointer-y", y + "%");
            });

            card.addEventListener("pointerleave", function () {
                card.style.removeProperty("--pointer-x");
                card.style.removeProperty("--pointer-y");
            });
        });

        console.log("Premium portfolio effects activated.");
    }

    // Works whether this code loads before or after DOMContentLoaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPremiumPortfolio, {
            once: true
        });
    } else {
        initPremiumPortfolio();
    }
})();
