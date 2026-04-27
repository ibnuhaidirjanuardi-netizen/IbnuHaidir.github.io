/**
 * IBNU H.J PORTFOLIO - FINAL STABLE SCRIPT
 */

// --- 1. GLOBAL UTILITIES ---

function removeSkeleton(img) {
    const wrapper = img.parentElement;
    if (wrapper) {
        wrapper.classList.remove('skeleton');
        img.style.opacity = "1";
    }
}

// --- 2. INITIALIZATION ON DOM READY ---

document.addEventListener("DOMContentLoaded", function() {
    
    // --- A. NAV & HAMBURGER LOGIC ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Tutup menu saat link diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- B. SMART NAVBAR (HIDE ON SCROLL) ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add('navbar-hidden');
            // Otomatis tutup menu lemari jika navbar sembunyi
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- C. THEME ENGINE ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    };

    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    // --- D. TYPEWRITER EFFECT ---
    const textElement = document.getElementById("typewriter");
    if (textElement) {
        const words = ["Kreator Digital", "Web Developer", "Drone Pilot", "Profesional"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            textElement.textContent = isDeleting 
                ? currentWord.substring(0, charIndex--) 
                : currentWord.substring(0, charIndex++);

            let typeSpeed = isDeleting ? 60 : 120;

            if (!isDeleting && charIndex > currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex < 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                charIndex = 0;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- E. SCROLL REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});

// --- 3. WINDOW LOAD (PRELOADER & SKELETON) ---

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-finish');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 500);
    }

    // Skeleton check untuk gambar yang sudah masuk cache
    document.querySelectorAll('.card-image-wrapper img').forEach(img => {
        if (img.complete) removeSkeleton(img);
        img.onload = () => removeSkeleton(img);
    });
});
