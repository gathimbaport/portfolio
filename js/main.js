/* ==========================================================================
   Gathimba | Quantity Surveyor — main.js
   Powers: scroll progress, sticky header, mobile menu, reveal-on-scroll,
   project tabs / slider, and the hero card toast.
   ========================================================================== */

(() => {
    'use strict';

    const $  = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pad = (n) => String(n).padStart(2, '0');


    /* ----------------------------------------------------------------------
       1. Scroll progress + header state
       ---------------------------------------------------------------------- */
    const progress = $('#pageProgress');
    const header   = $('#siteHeader');
    let ticking = false;

    const updateScroll = () => {
        const y   = window.scrollY || document.documentElement.scrollTop;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        if (header)   header.classList.toggle('scrolled', y > 8);

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateScroll);
        }
    }, { passive: true });

    window.addEventListener('resize', updateScroll);
    updateScroll();


    /* ----------------------------------------------------------------------
       2. Mobile navigation
       ---------------------------------------------------------------------- */
    const toggle = $('#menuToggle');
    const nav    = $('#mainNav');

    if (toggle && nav) {
        const setNav = (open) => {
            nav.classList.toggle('open', open);
            document.body.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        };

        toggle.addEventListener('click', () => {
            setNav(toggle.getAttribute('aria-expanded') !== 'true');
        });

        $$('a', nav).forEach((link) => link.addEventListener('click', () => setNav(false)));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                setNav(false);
                toggle.focus();
            }
        });

        window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
            if (e.matches) setNav(false);
        });
    }


    /* ----------------------------------------------------------------------
       3. Reveal on scroll
       ---------------------------------------------------------------------- */
    const revealEls = $$('.reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }


    /* ----------------------------------------------------------------------
       4. Toast
       ---------------------------------------------------------------------- */
    const toast = $('#projectToast');
    let toastTimer;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    };


    /* ----------------------------------------------------------------------
       5. Project showcase (tabs, arrows, dots)
       ---------------------------------------------------------------------- */
    const projects = [
        {
            key: 'residential',
            type: 'RESIDENTIAL',
            title: 'Residential Developments',
            description: 'Financial management of Residential development through cost planning tools and detailed and accurate cost estimates. ',
            focus: 'Financial Management',
            role:'Quantity Surveying',
            approach:'Estimates • Bqs • Contract Management • Financial Appraisals and Valuations ',
            image: 'image/Residential House.jpeg',
            alt: 'Residential development'
        },
        {
            key: 'affordable',
            type: 'AFFORDABLE HOUSING',
            title: 'FinanciaManagement and Cost Advice',
            description: 'Involved in the ongoing Affordable Housing Programme .',
            focus: 'Project Supervision and Financial Management ',
            role: 'Supervision',
            approach: 'Value • Timelines • Delivery',
            image: 'image/Affordabl hse.jpeg',
            alt: 'Affordable housing construction'
        },
        {
            key: 'fitout',
            type: 'FITOUT WORKS',
            title: 'Renovation & Fitout Works',
            description: 'Costing, measurement and Costing of finishes, Completion works and Renovations works.',
            focus: 'Measurement & Costing',
            role: 'Costing & Valuation',
            approach: 'Detail • Accuracy • Quality',
            image: 'image/Fitout works.jpeg',
            alt: 'Fitout and renovation works'
        }
    ];

    const showcase = $('.project-showcase');
    const tabs     = $$('.project-tab');
    const dotsWrap = $('#projectDots');

    const el = {
        image:       $('#projectImage'),
        counter:     $('#projectCounter'),
        type:        $('#projectType'),
        title:       $('#projectTitle'),
        description: $('#projectDescription'),
        focus:       $('#projectFocus'),
        role:        $('#projectRole'),
        approach:    $('#projectApproach'),
        prev:        $('#projectPrev'),
        next:        $('#projectNext')
    };

    if (showcase && tabs.length && el.image && dotsWrap) {

        let current = 0;
        let switchTimer;

        // Build the dots once
        const dots = projects.map((project, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'project-dot';
            dot.setAttribute('aria-label', `Show project ${i + 1} of ${projects.length}: ${project.type.toLowerCase()}`);
            dot.addEventListener('click', () => setProject(i));
            dotsWrap.appendChild(dot);
            return dot;
        });

        // Write the given project into the DOM
        const render = (i) => {
            const p = projects[i];

            el.image.src = p.image;
            el.image.alt = p.alt;
            el.counter.textContent = `${pad(i + 1)} / ${pad(projects.length)}`;
            el.type.textContent = p.type;
            el.title.textContent = p.title;
            el.description.textContent = p.description;
            el.focus.textContent = p.focus;
            el.role.textContent = p.role;
            el.approach.textContent = p.approach;

            tabs.forEach((tab) => {
                const isActive = tab.dataset.tab === p.key;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', String(isActive));
                tab.tabIndex = isActive ? 0 : -1;
                if (isActive) showcase.setAttribute('aria-labelledby', tab.id);
            });

            dots.forEach((dot, idx) => {
                const isActive = idx === i;
                dot.classList.toggle('active', isActive);
                if (isActive) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
        };

        // Switch with a short fade
        function setProject(index) {
            const i = (index + projects.length) % projects.length;
            if (i === current) return;

            current = i;
            clearTimeout(switchTimer);

            if (reduceMotion) {
                render(i);
                return;
            }

            showcase.classList.add('is-changing');

            switchTimer = setTimeout(() => {
                render(i);

                const reveal = () => showcase.classList.remove('is-changing');

                if (el.image.complete) {
                    requestAnimationFrame(reveal);
                } else {
                    el.image.addEventListener('load', reveal, { once: true });
                    el.image.addEventListener('error', reveal, { once: true });
                }
            }, 220);
        }

        // Tabs: click + keyboard (arrow keys, Home, End)
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const idx = projects.findIndex((p) => p.key === tab.dataset.tab);
                if (idx > -1) setProject(idx);
            });
        });

        const tablist = $('.project-tabs');
        if (tablist) {
            tablist.addEventListener('keydown', (e) => {
                const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
                if (!keys.includes(e.key)) return;
                e.preventDefault();

                let target = current;
                if (e.key === 'ArrowRight') target = current + 1;
                if (e.key === 'ArrowLeft')  target = current - 1;
                if (e.key === 'Home')       target = 0;
                if (e.key === 'End')        target = projects.length - 1;

                setProject(target);
                const idx = (target + projects.length) % projects.length;
                tabs[idx].focus();
            });
        }

        // Arrows
        if (el.prev) el.prev.addEventListener('click', () => setProject(current - 1));
        if (el.next) el.next.addEventListener('click', () => setProject(current + 1));

        // Hero cards jump to the matching project
        $$('.showcase-card').forEach((card) => {
            card.addEventListener('click', () => {
                const idx = projects.findIndex((p) => p.key === card.dataset.tab);
                if (idx > -1) setProject(idx);

                const target = $('#projects-preview');
                if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

                showToast(`Showing ${card.dataset.project}`);
            });
        });

        // Initial state + warm the image cache once the page has loaded
        render(0);

        window.addEventListener('load', () => {
            projects.forEach((p) => {
                const img = new Image();
                img.src = p.image;
            });
        });
    }

})();
/* ==========================================================================
   Gathimba | Quantity Surveyor — services.js
   Loaded AFTER main.js (which handles the header, progress bar, mobile
   menu and reveal-on-scroll). This file adds:
   - service filtering by project stage (with lifecycle-panel shortcuts)
   - live service counts and an accessible status message
   - cursor spotlight on service cards
   - FAQ accordion (one open at a time)
   ========================================================================== */

(() => {
    'use strict';

    const $  = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const grid   = $('#servicesGrid');
    const status = $('#filterStatus');

    if (!grid) return;

    const cards = $$('.service-card', grid);
    const chips = $$('.filter-chip');

    const stageLabels = {
        all:    'all services',
        pre:    'before construction',
        during: 'during construction',
        close:  'project close-out'
    };


    /* ----------------------------------------------------------------------
       1. Live counts (keeps the badges correct if cards are added later)
       ---------------------------------------------------------------------- */
    const countFor = (key) =>
        key === 'all' ? cards.length : cards.filter((c) => c.dataset.stage === key).length;

    $$('[data-count]').forEach((node) => {
        node.textContent = countFor(node.dataset.count);
    });


    /* ----------------------------------------------------------------------
       2. Filtering
       ---------------------------------------------------------------------- */
    let currentFilter = 'all';

    const applyFilter = (key) => {
        if (!(key in stageLabels)) key = 'all';

        currentFilter = key;

        // Chip state
        chips.forEach((chip) => {
            const isActive = chip.dataset.filter === key;
            chip.classList.toggle('active', isActive);
            chip.setAttribute('aria-pressed', String(isActive));
        });

        // Show / hide cards
        const visible = [];
        cards.forEach((card) => {
            const match = key === 'all' || card.dataset.stage === key;
            card.hidden = !match;
            card.classList.remove('span-2');
            if (match) visible.push(card);
        });

        // An odd card left on its own row spans the full width
        if (visible.length % 2 === 1) {
            visible[visible.length - 1].classList.add('span-2');
        }

        // Re-run the entrance animation with a short stagger
        visible.forEach((card, i) => {
            card.style.setProperty('--d', reduceMotion ? '0s' : `${i * 55}ms`);
            card.classList.remove('is-visible');
            void card.offsetWidth; // restart the animation
            card.classList.add('is-visible');
        });

        // Screen-reader friendly status
        if (status) {
            const n = visible.length;
            status.textContent = key === 'all'
                ? `Showing all ${n} services`
                : `Showing ${n} ${n === 1 ? 'service' : 'services'}: ${stageLabels[key]}`;
        }
    };

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            if (chip.dataset.filter !== currentFilter) applyFilter(chip.dataset.filter);
        });
    });

    // Lifecycle panel: filter, then bring the services into view
    $$('[data-jump]').forEach((button) => {
        button.addEventListener('click', () => {
            applyFilter(button.dataset.jump);

            const target = $('#services');
            if (target) {
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });


    /* ----------------------------------------------------------------------
       3. Cursor spotlight on cards (mouse / trackpad only)
       ---------------------------------------------------------------------- */
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (finePointer && !reduceMotion) {
        grid.addEventListener('pointermove', (e) => {
            const card = e.target.closest('.service-card');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    }


    /* ----------------------------------------------------------------------
       4. FAQ accordion — one open at a time
       ---------------------------------------------------------------------- */
    const faqs = $$('.faq-item');

    faqs.forEach((item) => {
        item.addEventListener('toggle', () => {
            if (!item.open) return;
            faqs.forEach((other) => {
                if (other !== item) other.open = false;
            });
        });
    });

})();
/* ==========================================================================
   Gathimba | Quantity Surveyor — projects.js
   Loaded AFTER main.js (header, progress bar, mobile menu, reveal-on-scroll).
   Cards are static HTML, grouped by type; this file only adds:
   - flip behaviour per card (click / Enter / Space)
   - a "flip all" toggle
   - ongoing / completed counts in the header
   ========================================================================== */

(() => {
    'use strict';

    const $  = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

    const cards = $$('.flashcard');
    if (!cards.length) return;


    /* ----------------------------------------------------------------------
       1. Individual card flip
       ---------------------------------------------------------------------- */
    const setFlipped = (card, flipped) => {
        card.classList.toggle('is-flipped', flipped);
        $('.flashcard-inner', card)?.setAttribute('aria-pressed', String(flipped));
    };

    cards.forEach((card) => {
        const trigger = $('.flashcard-inner', card);
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            setFlipped(card, !card.classList.contains('is-flipped'));
        });

        // trigger is a div[role="button"], so Enter/Space need wiring by hand
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped(card, !card.classList.contains('is-flipped'));
            }
        });
    });


    /* ----------------------------------------------------------------------
       2. Flip all / unflip all
       ---------------------------------------------------------------------- */
    const flipAllBtn = $('#flipAllBtn');

    if (flipAllBtn) {
        flipAllBtn.addEventListener('click', () => {
            const flipping = flipAllBtn.getAttribute('aria-pressed') !== 'true';
            flipAllBtn.setAttribute('aria-pressed', String(flipping));
            flipAllBtn.querySelector('.icon').textContent = flipping ? '⟳' : '⟲';
            cards.forEach((card) => setFlipped(card, flipping));
        });
    }


    /* ----------------------------------------------------------------------
       3. Ongoing / completed counts, read straight from the cards
       ---------------------------------------------------------------------- */
    const statuses = $$('.front-status').map((el) => el.dataset.status);

    const setText = (id, value) => {
        const node = document.getElementById(id);
        if (node) node.textContent = value;
    };

    setText('statOngoing', statuses.filter((s) => s === 'ongoing').length);
    setText('statCompleted', statuses.filter((s) => s === 'completed').length);

})();
/* ==========================================================================
   Gathimba | Quantity Surveyor — projects.js
   Loaded AFTER main.js (header, progress bar, mobile menu, reveal-on-scroll).
   Pill tabs pick a category; the showcase below steps through that
   category's three projects with prev/next arrows and dots, fading between
   them the same way the homepage's own showcase does — but this is a
   separate implementation (distinct ids/classes) so it doesn't collide with
   main.js's homepage-specific showcase code.
   ========================================================================== */

(() => {
    'use strict';

    const $  = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pad = (n) => String(n).padStart(2, '0');


    /* ----------------------------------------------------------------------
       1. Data — three projects per category
       ---------------------------------------------------------------------- */
    const categories = {
        residential: {
            label: 'Residential',
            projects: [
                {
                    code: 'RES / 001', title: 'Residential Housing Development',
                    description: 'Residential housing scheme involving cost planning, measurement and financial monitoring.',
                    role: 'QS Support', scope: 'BOQs & Valuations', status: 'ongoing',
                    image: 'image/turning value.jpeg', alt: 'Residential Housing Development'
                },
                {
                    code: 'RES / 002', title: 'Tatu Residential Development',
                    description: 'Residential development involving construction measurement and quantity surveying support.',
                    role: 'Quantity Surveying', scope: 'Measurement & Costing', status: 'completed',
                    image: 'Gallery/Tatu.jpeg', alt: 'Tatu Residential Project'
                },
                {
                    code: 'RES / 003', title: 'Private Residential Development',
                    description: 'Quantity surveying support covering construction costing, measurement and financial assessment.',
                    role: 'QS Support', scope: 'Cost Planning', status: 'ongoing',
                    image: 'images/Residential.jpeg', alt: 'Private Residential Development'
                }
            ]
        },
        government: {
            label: 'Government',
            projects: [
                {
                    code: 'GOV / 001', title: 'Archers Post Government Housing',
                    description: 'Government housing project involving site inspections, measurement and construction valuations.',
                    role: 'Assistant QS', scope: 'Inspections & Valuations', status: 'ongoing',
                    image: 'image/turning value.jpeg', alt: 'Archers Post Government Housing'
                },
                {
                    code: 'GOV / 002', title: 'Government Housing Development',
                    description: 'Construction project involving site measurement and assessment of completed works.',
                    role: 'Assistant QS', scope: 'Measurement', status: 'ongoing',
                    image: 'images/archers%20post.jpeg', alt: 'Government Housing Development'
                },
                {
                    code: 'GOV / 003', title: 'Government Housing Scheme',
                    description: 'Supporting construction progress monitoring and financial assessment of completed works.',
                    role: 'Assistant QS', scope: 'Valuations', status: 'ongoing',
                    image: 'images/archers%20post.jpeg', alt: 'Government Housing Scheme'
                }
            ]
        },
        fitout: {
            label: 'Fitout Works',
            projects: [
                {
                    code: 'FIT / 001', title: 'Renovation & Fitout Works',
                    description: 'Internal refurbishment and fitout works including finishes and building services installations.',
                    role: 'Quantity Surveyor', scope: 'Costing & Measurement', status: 'ongoing',
                    image: 'image/turning value.jpeg', alt: 'Renovation and Fitout Works'
                },
                {
                    code: 'FIT / 002', title: 'Commercial Fitout Works',
                    description: 'Fitout works involving measurement, costing and assessment of internal construction works.',
                    role: 'Quantity Surveyor', scope: 'Costing', status: 'completed',
                    image: 'images/renovation%20works.jpeg', alt: 'Commercial Fitout Project'
                },
                {
                    code: 'FIT / 003', title: 'Building Renovation Works',
                    description: 'Refurbishment works aimed at improving functionality, appearance and usability of an existing building.',
                    role: 'Quantity Surveyor', scope: 'Renovation Costing', status: 'ongoing',
                    image: 'images/renovation%20works.jpeg', alt: 'Building Renovation Project'
                }
            ]
        }
    };


    /* ----------------------------------------------------------------------
       2. Elements
       ---------------------------------------------------------------------- */
    const tabs     = $$('.type-tab');
    const showcase = $('#typeShowcase');
    const dotsWrap = $('#typeDots');

    if (!tabs.length || !showcase || !dotsWrap) return;

    const el = {
        image: $('#typeImage'),
        counter: $('#typeCounter'),
        status: $('#typeStatus'),
        statusText: $('#typeStatusText'),
        code: $('#typeCode'),
        title: $('#typeTitle'),
        description: $('#typeDescription'),
        role: $('#typeRole'),
        scope: $('#typeScope'),
        value: $('#typeValue'),
        prev: $('#typePrev'),
        next: $('#typeNext')
    };


    /* ----------------------------------------------------------------------
       3. State
       ---------------------------------------------------------------------- */
    let currentCategory = 'residential';
    let currentIndex = 0;
    let switchTimer;

    const render = () => {
        const list = categories[currentCategory].projects;
        const p = list[currentIndex];

        el.image.src = p.image;
        el.image.alt = p.alt;
        el.counter.textContent = `${pad(currentIndex + 1)} / ${pad(list.length)}`;
        el.status.dataset.status = p.status;
        el.statusText.textContent = p.status === 'ongoing' ? 'Ongoing' : 'Completed';
        el.code.textContent = `${categories[currentCategory].label.toUpperCase()} / ${p.code}`;
        el.title.textContent = p.title;
        el.description.textContent = p.description;
        el.role.textContent = p.role;
        el.scope.textContent = p.scope;
        el.value.textContent = 'Available on request';

        showcase.setAttribute('aria-labelledby', `type-${currentCategory}`);

        // Rebuild dots for this category's project count
        dotsWrap.innerHTML = '';
        list.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'type-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `Show project ${i + 1} of ${list.length}`);
            if (i === currentIndex) dot.setAttribute('aria-current', 'true');
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });
    };

    function fadeTo(mutate) {
        clearTimeout(switchTimer);

        if (reduceMotion) {
            mutate();
            render();
            return;
        }

        showcase.classList.add('is-changing');

        switchTimer = setTimeout(() => {
            mutate();
            render();

            const reveal = () => showcase.classList.remove('is-changing');
            if (el.image.complete) {
                requestAnimationFrame(reveal);
            } else {
                el.image.addEventListener('load', reveal, { once: true });
                el.image.addEventListener('error', reveal, { once: true });
            }
        }, 220);
    }

    function goTo(index) {
        const list = categories[currentCategory].projects;
        const i = (index + list.length) % list.length;
        if (i === currentIndex) return;
        fadeTo(() => { currentIndex = i; });
    }

    function switchCategory(key) {
        if (key === currentCategory || !categories[key]) return;

        tabs.forEach((tab) => {
            const isActive = tab.dataset.type === key;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });

        fadeTo(() => {
            currentCategory = key;
            currentIndex = 0;
        });
    }


    /* ----------------------------------------------------------------------
       4. Wiring
       ---------------------------------------------------------------------- */
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => switchCategory(tab.dataset.type));
    });

    const tablist = $('.type-tabs');
    if (tablist) {
        tablist.addEventListener('keydown', (e) => {
            const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
            if (!keys.includes(e.key)) return;
            e.preventDefault();

            const keysList = Object.keys(categories);
            const current = keysList.indexOf(currentCategory);
            let target = current;

            if (e.key === 'ArrowRight') target = (current + 1) % keysList.length;
            if (e.key === 'ArrowLeft')  target = (current - 1 + keysList.length) % keysList.length;
            if (e.key === 'Home')       target = 0;
            if (e.key === 'End')        target = keysList.length - 1;

            switchCategory(keysList[target]);
            tabs[target].focus();
        });
    }

    el.prev?.addEventListener('click', () => goTo(currentIndex - 1));
    el.next?.addEventListener('click', () => goTo(currentIndex + 1));


    /* ----------------------------------------------------------------------
       5. Initial paint + warm the image cache
       ---------------------------------------------------------------------- */
    render();

    window.addEventListener('load', () => {
        Object.values(categories).forEach((cat) => {
            cat.projects.forEach((p) => {
                const img = new Image();
                img.src = p.image;
            });
        });
    });

})();
