/* ================================================================
   VOIDKULT — STREETWEAR BRAND WEBSITE
   JavaScript — Interactions, Animations & Logic
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ PRELOADER ============
    const preloader = document.getElementById('preloader');
    const heroImage = document.getElementById('hero-image');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';

            // Trigger hero image zoom
            setTimeout(() => {
                heroImage.classList.add('loaded');
            }, 300);
        }, 2600);
    });

    // Prevent scrolling during preload
    document.body.style.overflow = 'hidden';

    // ============ CUSTOM CURSOR ============
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });

    // Smooth follower
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, input, .product-card, .gallery-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    // ============ NAVBAR SCROLL EFFECT ============
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ============ MOBILE MENU ============
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // ============ COUNTDOWN TIMER ============
    // Set drop date to 7 days from now
    const dropDate = new Date();
    dropDate.setDate(dropDate.getDate() + 7);
    dropDate.setHours(18, 0, 0, 0); // 6 PM

    function updateCountdown() {
        const now = new Date();
        const diff = dropDate - now;

        if (diff <= 0) {
            document.querySelectorAll('.countdown-number').forEach(el => {
                el.textContent = '00';
            });
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.querySelector('[data-target="days"]');
        const hoursEl = document.querySelector('[data-target="hours"]');
        const minutesEl = document.querySelector('[data-target="minutes"]');
        const secondsEl = document.querySelector('[data-target="seconds"]');

        if (daysEl) animateNumber(daysEl, days);
        if (hoursEl) animateNumber(hoursEl, hours);
        if (minutesEl) animateNumber(minutesEl, minutes);
        if (secondsEl) animateNumber(secondsEl, seconds);
    }

    function animateNumber(el, value) {
        const formatted = String(value).padStart(2, '0');
        if (el.textContent !== formatted) {
            el.style.transform = 'translateY(-5px)';
            el.style.opacity = '0.5';
            setTimeout(() => {
                el.textContent = formatted;
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
            }, 150);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============ PRODUCT FILTERING ============
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = '';
                        requestAnimationFrame(() => {
                            card.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }, index * 80);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ============ QUICK ADD TO CART ============
    let cartCount = 0;
    const cartCountEl = document.querySelector('.cart-count');
    const quickAddBtns = document.querySelectorAll('.quick-add:not(.sold-out)');

    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartCount++;
            cartCountEl.textContent = cartCount;

            // Animate cart count
            cartCountEl.style.transform = 'scale(1.4)';
            setTimeout(() => {
                cartCountEl.style.transform = 'scale(1)';
            }, 200);

            // Show toast
            const productName = btn.closest('.product-card').querySelector('.product-name').textContent;
            showToast(`${productName} added to cart`);

            // Button feedback
            const originalText = btn.textContent;
            btn.textContent = '✓ ADDED';
            btn.style.background = '#2ecc71';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        });
    });

    // ============ TOAST NOTIFICATION ============
    function showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span class="toast-icon">✦</span> ${message}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ============ EMAIL SUBSCRIPTION (Drop Notify) ============
    const notifyBtn = document.getElementById('notify-btn');
    const notifyEmail = document.getElementById('notify-email');

    notifyBtn?.addEventListener('click', () => {
        const email = notifyEmail.value.trim();
        if (email && email.includes('@')) {
            showToast('You\'ll be notified when the drop goes live! 🔥');
            notifyEmail.value = '';
        } else {
            showToast('Please enter a valid email address');
        }
    });

    // ============ NEWSLETTER SUBSCRIPTION ============
    const newsletterBtn = document.getElementById('newsletter-btn');
    const newsletterEmail = document.getElementById('newsletter-email');

    newsletterBtn?.addEventListener('click', () => {
        const email = newsletterEmail.value.trim();
        if (email && email.includes('@')) {
            showToast('Welcome to the VOID. Check your inbox. 🖤');
            newsletterEmail.value = '';
        } else {
            showToast('Please enter a valid email address');
        }
    });

    // ============ SCROLL REVEAL ANIMATIONS ============
    const revealElements = document.querySelectorAll(
        '.drop-header, .countdown-wrapper, .drop-notify, ' +
        '.collection-header, .product-card, ' +
        '.lookbook-header, .gallery-item, ' +
        '.about-left, .about-right, .about-stat, ' +
        '.newsletter-content'
    );

    // Add reveal classes
    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
                if (siblings) {
                    const index = Array.from(siblings).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                } else {
                    entry.target.classList.add('visible');
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============ STAT COUNTER ANIMATION ============
    const statNumbers = document.querySelectorAll('.stat-number');

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const step = target / 60;
        const duration = 1500;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // ============ PARALLAX HERO ============
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroImg = document.querySelector('.hero-bg img');
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(${1 + scrolled * 0.0003}) translateY(${scrolled * 0.3}px)`;
        }
    });

    // ============ SMOOTH SCROLL FOR NAV LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ GALLERY LIGHTBOX EFFECT ============
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = '';
            }, 200);
        });
    });

    // ============ KEYBOARD ACCESSIBILITY ============
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ============ GLITCH TEXT EFFECT ON HOVER ============
    const glitchTargets = document.querySelectorAll('.section-title.oversized');
    glitchTargets.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.textShadow = `
                2px 0 var(--accent), -2px 0 #ff00ff,
                0 2px var(--accent), 0 -2px #00ffff
            `;
            setTimeout(() => {
                title.style.textShadow = 'none';
            }, 150);
            setTimeout(() => {
                title.style.textShadow = `
                    -1px 0 var(--accent), 1px 0 #ff00ff
                `;
            }, 200);
            setTimeout(() => {
                title.style.textShadow = 'none';
            }, 350);
        });
    });

    console.log('%c VOIDKULT ', 'background: #d4ff00; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Wear the Void. ', 'color: #b3b3b3; font-size: 12px;');
});
