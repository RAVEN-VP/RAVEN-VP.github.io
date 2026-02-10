document.addEventListener('DOMContentLoaded', () => {

    // --- Team member rendering from team.json ---
    fetch('team.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('team-members');
            data.forEach(member => {
                const card = document.createElement('div');
                card.className = 'team-member reveal';
                card.innerHTML = `
                    <h3>${member.name}</h3>
                    <p><strong>${member.role}</strong></p>
                    <p>${member.bio}</p>
                `;
                container.appendChild(card);
            });
            // Re-observe newly added team cards
            card_observer_setup();
        });

    // --- Navbar scroll behavior ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // --- Scroll reveal with Intersection Observer ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    function card_observer_setup() {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            revealObserver.observe(el);
        });
    }

    card_observer_setup();

    // --- Animated metric counters ---
    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
                metricObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-number[data-target]').forEach(el => {
        metricObserver.observe(el);
    });

    function animateCounter(el, target) {
        const duration = 1200;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // --- Smooth scroll for nav links (fallback for browsers without CSS smooth scroll) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
