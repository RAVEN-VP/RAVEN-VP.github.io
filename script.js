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

    // --- Concept image scroll-driven scale reveal ---
    const conceptSection = document.getElementById('concept');
    const conceptImg = conceptSection ? conceptSection.querySelector('.concept-img') : null;
    const conceptCaption = conceptSection ? conceptSection.querySelector('.concept-caption') : null;
    const conceptDesc = conceptSection ? conceptSection.querySelector('.concept-description') : null;

    if (conceptImg) {
        // Detect mobile for reduced scale range
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const scaleStart = isMobile ? 0.92 : 0.85;
        const scaleEnd = 1;
        const opacityStart = 0.6;
        const opacityEnd = 1;
        let ticking = false;

        function updateConceptScroll() {
            const rect = conceptSection.getBoundingClientRect();
            const windowH = window.innerHeight;

            // Progress: 0 when section top enters viewport bottom, 1 when section top reaches viewport center
            const start = windowH;
            const end = windowH * 0.3;
            const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

            // Ease-out cubic for smoother feel
            const eased = 1 - Math.pow(1 - progress, 3);

            const scale = scaleStart + (scaleEnd - scaleStart) * eased;
            const opacity = opacityStart + (opacityEnd - opacityStart) * eased;

            conceptImg.style.transform = `scale(${scale})`;
            conceptImg.style.opacity = opacity;

            // Reveal caption and description at 80% progress
            if (eased > 0.8) {
                if (conceptCaption) conceptCaption.classList.add('visible');
                if (conceptDesc) conceptDesc.classList.add('visible');
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateConceptScroll);
                ticking = true;
            }
        }, { passive: true });

        // Run once on load in case section is already in view
        updateConceptScroll();
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
