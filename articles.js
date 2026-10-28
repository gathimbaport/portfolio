document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GET ELEMENTS FROM ARTICLES.HTML
    ===================================================== */

    const openArticle = document.getElementById("openArticle");
    const closeArticle = document.getElementById("closeArticle");

    const fullArticle = document.getElementById("fullArticle");
    const articlesSection = document.getElementById("articles");

    const filterButtons = document.querySelectorAll(".filter-btn");
    const articleCards = document.querySelectorAll(".article-card");

    const mobileMenu = document.querySelector(".mobile-menu");
    const mainNav = document.querySelector(".main-nav");


    /* =====================================================
       FULL ARTICLE - INITIAL STATE
    ===================================================== */

    if (fullArticle) {
        fullArticle.style.display = "none";
    }


    /* =====================================================
       OPEN FULL ARTICLE
    ===================================================== */

    if (openArticle) {

        openArticle.addEventListener("click", function () {

            console.log("Read Full Article button clicked");

            if (articlesSection) {
                articlesSection.style.display = "none";
            }

            if (fullArticle) {
                fullArticle.style.display = "block";
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       CLOSE FULL ARTICLE
    ===================================================== */

    if (closeArticle) {

        closeArticle.addEventListener("click", function () {

            console.log("Back to Articles button clicked");

            if (fullArticle) {
                fullArticle.style.display = "none";
            }

            if (articlesSection) {
                articlesSection.style.display = "block";
            }

            setTimeout(function () {

                if (articlesSection) {

                    articlesSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 100);

        });

    }


    /* =====================================================
       ARTICLE CATEGORY FILTERS
    ===================================================== */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedCategory =
                button.getAttribute("data-filter");


            /* Remove active from all buttons */

            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            /* Add active to clicked button */

            button.classList.add("active");


            /* Show / hide articles */

            articleCards.forEach(function (card) {

                const category =
                    card.getAttribute("data-category");


                if (
                    selectedCategory === "all" ||
                    category === selectedCategory
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenu && mainNav) {

        mobileMenu.addEventListener("click", function () {

            mobileMenu.classList.toggle("active");

            const isOpen = mainNav.classList.toggle("active");

            mobileMenu.setAttribute("aria-expanded", isOpen);

        });


        /* Close menu when a navigation link is clicked */

        const navLinks =
            mainNav.querySelectorAll("a");


        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mobileMenu.classList.remove("active");

                mainNav.classList.remove("active");

                mobileMenu.setAttribute("aria-expanded", "false");

            });

        });


        /* Reset the menu when the screen grows past the mobile breakpoint */

        window.addEventListener("resize", function () {

            if (window.innerWidth > 850) {

                mobileMenu.classList.remove("active");

                mainNav.classList.remove("active");

                mobileMenu.setAttribute("aria-expanded", "false");

            }

        });

    }


    /* =====================================================
       CLOSE ARTICLE WITH ESC KEY
    ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (
                fullArticle &&
                fullArticle.style.display === "block"
            ) {

                fullArticle.style.display = "none";

                if (articlesSection) {

                    articlesSection.style.display = "block";

                }

            }

        }

    });


    /* =====================================================
       COMING SOON ARTICLES
    ===================================================== */

    const comingSoonButtons =
        document.querySelectorAll(".card-link");


    comingSoonButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            alert(
                "This article is coming soon. Check back later."
            );

        });

    });


    /* =====================================================
       LIVELY: HEADER, PROGRESS BAR, BACK TO TOP
    ===================================================== */

    const header = document.querySelector(".site-header");
    const progressBar = document.getElementById("readProgress");
    const backToTop = document.getElementById("backToTop");

    let ticking = false;

    function onScroll() {

        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        if (header) {
            header.classList.toggle("scrolled", scrollTop > 40);
        }

        if (progressBar) {
            const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
            progressBar.style.width = pct + "%";
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollTop > 500);
        }

        ticking = false;
    }

    window.addEventListener("scroll", function () {

        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }

    }, { passive: true });

    onScroll();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =====================================================
       LIVELY: SCROLL REVEAL
    ===================================================== */

    const revealSelectors = [
        ".section-heading",
        ".article-filters",
        ".featured-article",
        ".small-card",
        ".full-article-header",
        ".article-hero-image",
        ".article-body > *",
        ".footer-container"
    ];

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setupReveal(root) {

        if (reduceMotion || !("IntersectionObserver" in window)) {
            return;
        }

        const targets = root.querySelectorAll(revealSelectors.join(","));

        const observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) {
                    return;
                }

                const el = entry.target;

                el.classList.add("in");

                observer.unobserve(el);

                /* Remove helper classes afterwards so hover effects work */

                setTimeout(function () {
                    el.classList.remove("reveal", "reveal-left", "reveal-right");
                    el.style.transitionDelay = "";
                }, 1100);

            });

        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        targets.forEach(function (el, index) {

            el.classList.add("reveal");

            if (el.classList.contains("featured-image")) {
                el.classList.add("reveal-left");
            }

            /* Stagger cards that sit in the same row */

            if (el.classList.contains("small-card")) {
                el.style.transitionDelay = (index % 3) * 0.12 + "s";
            }

            observer.observe(el);

        });

    }

    setupReveal(document);


    /* Animate cards when a filter shows them */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            articleCards.forEach(function (card) {

                if (card.style.display !== "none") {

                    card.classList.remove("show-anim");

                    /* force reflow so the animation restarts */
                    void card.offsetWidth;

                    card.classList.add("show-anim");

                }

            });

        });

    });


    /* Animate the full article when it opens */

    if (openArticle && fullArticle) {

        openArticle.addEventListener("click", function () {

            fullArticle.classList.remove("article-open");

            void fullArticle.offsetWidth;

            fullArticle.classList.add("article-open");

        });

    }


    /* =====================================================
       DEBUG MESSAGE
       This confirms that articles.js is loaded.
    ===================================================== */

    console.log("Articles JavaScript loaded successfully.");

});