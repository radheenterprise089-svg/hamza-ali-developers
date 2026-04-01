(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
            });
        });

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (!navMenu.classList.contains('is-open')) return;
            if (target.closest('#navMenu') || target.closest('.nav-toggle')) return;
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        });
    }

    // Active nav link based on scroll
    const sections = ['services', 'about', 'work', 'contact']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const linkById = new Map(
        navLinks
            .map((a) => {
                const hash = a.getAttribute('href') || '';
                const id = hash.startsWith('#') ? hash.slice(1) : '';
                return [id, a];
            })
            .filter(([id]) => Boolean(id))
    );

    const setActive = (id) => {
        navLinks.forEach((a) => a.classList.remove('is-active'));
        const link = linkById.get(id);
        if (link) link.classList.add('is-active');
    };

    if (sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
                if (visible?.target?.id) setActive(visible.target.id);
            },
            { rootMargin: '-30% 0px -60% 0px', threshold: [0.1, 0.2, 0.3, 0.4] }
        );
        sections.forEach((s) => sectionObserver.observe(s));
    }

    // Reveal-on-scroll
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    if (reveals.length) {
        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        if (prefersReduced) {
            reveals.forEach((el) => el.classList.add('is-visible'));
        } else {
            const revealObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
            );
            reveals.forEach((el) => revealObserver.observe(el));
        }
    }

    // Contact form (simple demo)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('name')?.value || '').trim();
            const email = (document.getElementById('email')?.value || '').trim();

            if (formStatus) {
                formStatus.textContent = `Thanks${name ? `, ${name}` : ''}! Your message is ready. Please email us at ${email || 'your email'} — or use WhatsApp for faster reply.`;
            }

            form.reset();
        });
    }
})();
