/**
 * IBNU H.J PORTFOLIO - SMART POP-UP UPGRADED SCRIPT JS
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
    
    // --- PRELOADER REMOVAL ---
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            preloader.classList.add("preloader-finish");
        });
        // Safety timeout jika pemuatan asinkron memakan waktu terlalu lama
        setTimeout(() => {
            preloader.classList.add("preloader-finish");
        }, 2500);
    }

    // --- A. NAV & HAMBURGER LOGIC ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

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
            if (navbar) navbar.classList.add('navbar-hidden');
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        } else {
            if (navbar) navbar.classList.remove('navbar-hidden');
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
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- F. PREMIUM POP-UP MODAL ENGINE ---
    const popupOverlay = document.getElementById("custom-popup");
    const popupClose = document.querySelector(".popup-close");
    const mediaContainer = document.getElementById("popup-media-container");
    const popupTitle = document.getElementById("popup-title");
    const popupDesc = document.getElementById("popup-desc");
    const triggers = document.querySelectorAll(".popup-trigger");

    function openPopupEngine(type, src, title, desc) {
        if (!popupOverlay || !mediaContainer) return;

        // Kosongkan wadah media lama
        mediaContainer.innerHTML = "";

        // Isi konten teks
        if (popupTitle) popupTitle.textContent = title;
        if (popupDesc) popupDesc.textContent = desc;

        // Render Media berdasarkan tipe dokumen
        if (type === "pdf") {
            const iframe = document.createElement("iframe");
            iframe.src = src;
            iframe.className = "popup-pdf-frame";
            mediaContainer.appendChild(iframe);
        } 
        else if (type === "video") {
            const video = document.createElement("video");
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.style.width = "100%";
            mediaContainer.appendChild(video);
        } 
        else if (type === "image") {
            const img = document.createElement("img");
            img.src = src;
            img.alt = title;
            img.style.width = "100%";
            mediaContainer.appendChild(img);
        }

        // Jalankan animasi kelas aktif
        popupOverlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Kunci scroll halaman belakang
    }

    function closePopup() {
        if (!popupOverlay) return;
        popupOverlay.classList.remove("active");
        document.body.style.overflow = ""; // Kembalikan scroll reguler
        if (mediaContainer) mediaContainer.innerHTML = ""; // Matikan proses background media
    }

    // Pasangkan trigger dinamis ke elemen kelas '.popup-trigger'
    triggers.forEach(trigger => {
        trigger.addEventListener("click", function(e) {
            // Mencegah loncatan tautan jika pemicunya elemen anchor
            if (this.tagName === "A" || this.classList.contains("card") || this.classList.contains("cv-card")) {
                e.preventDefault();
            }
            
            const type = this.getAttribute("data-type");
            const src = this.getAttribute("data-src");
            const title = this.getAttribute("data-title");
            const desc = this.getAttribute("data-desc");

            if (type && src) {
                openPopupEngine(type, src, title, desc);
            }
        });
    });

    // Event listener penutup pop-up modal
    if (popupClose) {
        popupClose.addEventListener("click", closePopup);
    }
    if (popupOverlay) {
        popupOverlay.addEventListener("click", function(e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });
    }

    // Dukungan tombol ESC di keyboard untuk menutup jendela pop-up
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && popupOverlay.classList.contains("active")) {
            closePopup();
        }
    });
});
