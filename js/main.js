/* ============================================
   ZOHA NADEEM PORTFOLIO — MAIN JS
   ============================================ */

(function () {
    'use strict';

    /* -----------------------------------
       PRELOADER
    ----------------------------------- */
    window.addEventListener('load', function () {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        setTimeout(function () {
            preloader.classList.add('hidden');
            setTimeout(function () {
                preloader.style.display = 'none';
                // Trigger hero reveals after load
                document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(function (el, i) {
                    setTimeout(function () {
                        el.classList.add('visible');
                    }, i * 120);
                });
            }, 700);
        }, 1800);
    });

    /* -----------------------------------
       CUSTOM CURSOR
    ----------------------------------- */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower) {
        let mx = -100, my = -100, fx = -100, fy = -100;
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });
        function animateFollower() {
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
    }

    /* -----------------------------------
       SMOOTH SCROLL
    ----------------------------------- */
    document.querySelectorAll('a.smoothscroll').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = document.getElementById('header')?.offsetHeight || 72;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* -----------------------------------
       HEADER SCROLL STATE
    ----------------------------------- */
    const header = document.getElementById('header');
    function updateHeader() {
        if (!header) return;
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    /* -----------------------------------
       MOBILE MENU
    ----------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
            });
        });
    }

    /* -----------------------------------
       THEME SWITCHER
    ----------------------------------- */
    const themeToggle = document.getElementById('themeToggle');
    const themeKey = 'portfolio-theme';
    const getPreferredTheme = function () {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    const savedTheme = localStorage.getItem(themeKey);
    const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : getPreferredTheme();
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(themeKey, nextTheme);
            applyTheme(nextTheme);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
        if (!localStorage.getItem(themeKey)) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });

    /* -----------------------------------
       TITLE ROTATOR
    ----------------------------------- */
    const titleRotate = document.getElementById('titleRotate');
    if (titleRotate) {
        const items = titleRotate.querySelectorAll('span');
        let current = 0;
        setInterval(function () {
            current = (current + 1) % (items.length - 1); // last is duplicate of first
            titleRotate.style.transform = 'translateY(-' + (current * 1.4) + 'em)';
        }, 2800);
    }

    /* -----------------------------------
       SCROLL REVEAL
    ----------------------------------- */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Stagger children of same parent
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.querySelectorAll('.reveal-up, .reveal-right'));
                const idx = siblings.indexOf(entry.target);
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, idx * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) {
        // Skip hero elements (handled after preloader)
        if (!el.closest('.hero')) {
            revealObserver.observe(el);
        }
    });

    /* -----------------------------------
       COUNTER ANIMATION
    ----------------------------------- */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        if (!target) return;
        let current = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const interval = setInterval(function () {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(interval);
        }, 16);
    }
    const counterEls = document.querySelectorAll('.stat-num[data-count]');
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObserver.observe(el); });

    /* -----------------------------------
       CONTACT FORM → MAILTO
    ----------------------------------- */
    const sendBtn = document.getElementById('sendMailBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const name = document.getElementById('senderName')?.value?.trim() || '';
            const email = document.getElementById('senderEmail')?.value?.trim() || '';
            const message = document.getElementById('senderMessage')?.value?.trim() || '';
            if (!name || !email || !message) {
                alert('Please fill in all fields before sending.');
                return;
            }
            const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
            const body = encodeURIComponent('Hi Zoha,\n\n' + message + '\n\nBest regards,\n' + name + '\n' + email);
            window.location.href = 'mailto:zohanadeem45@gmail.com?subject=' + subject + '&body=' + body;
        });
    }

    /* -----------------------------------
       TIMELINE HOVER STAGGER
    ----------------------------------- */
    document.querySelectorAll('.timeline-item').forEach(function (item, i) {
        item.style.transitionDelay = (i * 60) + 'ms';
    });

    /* -----------------------------------
       PROJECT CARD TILT (subtle)
    ----------------------------------- */
    document.querySelectorAll('.project-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'translateY(-6px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease, border-color 0.35s, box-shadow 0.35s';
        });
        card.addEventListener('mouseenter', function () {
            card.style.transition = 'border-color 0.35s, box-shadow 0.35s';
        });
    });

})();
