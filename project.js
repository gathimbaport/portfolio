/* =========================================================
   projects.js  |  QS Gathimba
   STANDALONE: includes the menu, scroll progress, header
   and reveal behaviour, so main.js is not needed.
   Edit the PROJECTS object to change slide text and images.
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------
       PROJECT DATA
       The first slide of each category matches the HTML.
       If an image file is missing, the first image of that
       category is shown instead, so nothing looks broken.
       --------------------------------------------------- */
    var PROJECTS = {
        residential: [
            {
                image: "image/Completion Works.jpeg",
                alt: "Residential development",
                title: "Development & Cost Planning",
                description: "Cost planning, measurement and commercial support focused on creating clear financial visibility throughout a residential development.",
                focus: "Cost Planning",
                role: "Quantity Surveying",
                approach: "Measure • Plan • Control"
            },
            {
                image: "image/Residential 2.jpeg",
                alt: "Private residence",
                title: "Private Residence Valuation",
                description: "Interim valuations and final accounts prepared for a private residence so payments always match the work on site.",
                focus: "Valuations",
                role: "Quantity Surveying",
                approach: "Measure • Value • Certify"
            },
            {
                image: "image/Residential 3.jpeg",
                alt: "Gated estate",
                title: "Gated Estate Bills of Quantities",
                description: "Detailed bills of quantities for a multi-unit estate, giving contractors a fair and comparable basis for tender.",
                focus: "Tendering",
                role: "Quantity Surveying",
                approach: "Measure • Tender • Compare"
            }
        ],

        affordable: [
            {
                image: "image/Government projects.jpeg",
                alt: "Affordable housing scheme",
                title: "Affordable Housing Scheme",
                description: "Cost control and value engineering that keeps a large housing scheme within budget without cutting quality.",
                focus: "Cost Control",
                role: "Cost Consultant",
                approach: "Plan • Engineer • Control"
            },
            {
                image: "image/Affordable 2.jpeg",
                alt: "Apartment blocks",
                title: "Apartment Blocks Budgeting",
                description: "Elemental cost plans and budget tracking for repeat apartment blocks, so savings in one block carry into the next.",
                focus: "Budgeting",
                role: "Quantity Surveying",
                approach: "Estimate • Track • Report"
            },
            {
                image: "image/Affordable 3.jpeg",
                alt: "Estate infrastructure",
                title: "Estate Infrastructure Works",
                description: "Measurement and payment certification for roads, drainage and services serving a new housing estate.",
                focus: "Infrastructure",
                role: "Quantity Surveying",
                approach: "Measure • Certify • Close"
            }
        ],

        fitout: [
            {
                image: "image/Fitout works.jpeg",
                alt: "Office fitout",
                title: "Office Fitout Cost Management",
                description: "Fast, accurate pricing and variation tracking for an office fitout delivered on a tight programme.",
                focus: "Fitout Costs",
                role: "Quantity Surveying",
                approach: "Price • Track • Deliver"
            },
            {
                image: "image/Fitout 2.jpeg",
                alt: "Retail fitout",
                title: "Retail Space Fitout",
                description: "Bills of quantities and final accounts for a retail interior that had to open on a fixed date.",
                focus: "Final Accounts",
                role: "Quantity Surveying",
                approach: "Measure • Agree • Settle"
            },
            {
                image: "image/Fitout 3.jpeg",
                alt: "Restaurant fitout",
                title: "Hospitality Fitout",
                description: "Commercial support for a restaurant fitout, covering specialist packages and change control.",
                focus: "Change Control",
                role: "Commercial Support",
                approach: "Review • Negotiate • Control"
            }
        ]
    };

    var AUTOPLAY_SECONDS = 7;   /* also change "7s" in .pj-bar i in projects.css */

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var body = document.body;

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
    function pad(n) { return (n < 10 ? "0" : "") + n; }



    /* ---------------------------------------------------
       0. Site chrome: header, menu, scroll progress, reveal
       --------------------------------------------------- */
    var siteHeader = document.getElementById("siteHeader");
    var progress = document.getElementById("pageProgress");
    var menuToggle = document.getElementById("menuToggle");
    var mainNav = document.getElementById("mainNav");

    function onScroll() {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        if (progress) { progress.style.setProperty("--p", max > 0 ? Math.min(window.scrollY / max, 1) : 0); }
        if (siteHeader) { siteHeader.classList.toggle("scrolled", window.scrollY > 10); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setMenu(open) {
        if (!menuToggle || !mainNav) return;
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        mainNav.classList.toggle("open", open);
    }
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
        });
        $$("a", mainNav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
        window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });
    }

    /* hero reveal on load (staggered) */
    $$(".reveal").forEach(function (el, i) {
        setTimeout(function () { el.classList.add("in"); }, reduceMotion ? 0 : 120 + i * 160);
    });

    /* toast shown by the hero cards */
    var toast = document.getElementById("projectToast");
    var toastTimer = null;
    function showToast(text) {
        if (!toast) return;
        toast.textContent = text;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
    }

    /* ---------------------------------------------------
       1. Header height -> keeps the sticky tabs under the nav
       --------------------------------------------------- */
    function setHeaderHeight() {
        var header = document.getElementById("siteHeader");
        if (header) {
            document.documentElement.style.setProperty("--pj-header-h", header.offsetHeight + "px");
        }
    }
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
    window.addEventListener("load", setHeaderHeight);


    /* ---------------------------------------------------
       2. Hero spotlight follows the cursor
       --------------------------------------------------- */
    var hero = $(".pj-hero");
    if (hero && !reduceMotion) {
        hero.addEventListener("mousemove", function (e) {
            var r = hero.getBoundingClientRect();
            hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
            hero.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    }


    /* ---------------------------------------------------
       3. Hero cards jump to their section
       --------------------------------------------------- */
    $$(".showcase-card[data-target]").forEach(function (card) {
        card.addEventListener("click", function () {
            showToast("Showing " + (card.getAttribute("data-project") || "projects"));
            var target = $(card.getAttribute("data-target"));
            if (target) { target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
        });
    });


    /* ---------------------------------------------------
       4. Scroll entrance
       --------------------------------------------------- */
    var fxItems = $$(".pj-fx");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var fxObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    fxObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fxItems.forEach(function (el) { fxObserver.observe(el); });
    } else {
        fxItems.forEach(function (el) { el.classList.add("in"); });
    }


    /* ---------------------------------------------------
       5. Tabs highlight the section in view
       --------------------------------------------------- */
    var tabLinks = $$(".pj-tabs a");
    if ("IntersectionObserver" in window && tabLinks.length) {
        var tabObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                tabLinks.forEach(function (a) {
                    a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-40% 0px -55% 0px" });

        tabLinks.forEach(function (a) {
            var section = $(a.getAttribute("href"));
            if (section) { tabObserver.observe(section); }
        });
    }


    /* ---------------------------------------------------
       6. Image viewer
       --------------------------------------------------- */
    var lightbox = document.getElementById("pjLightbox");
    var lbImg = document.getElementById("pjLightboxImg");
    var lbCap = document.getElementById("pjLightboxCaption");
    var lbClose = document.getElementById("pjLightboxClose");
    var lastFocus = null;

    function openLightbox(src, alt, caption) {
        if (!lightbox) return;
        lastFocus = document.activeElement;
        lbImg.src = src;
        lbImg.alt = alt;
        lbCap.textContent = caption;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        body.classList.add("pj-lb-open");
        lbClose.focus();
        document.dispatchEvent(new Event("pj:lightbox"));
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        body.classList.remove("pj-lb-open");
        if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
        document.dispatchEvent(new Event("pj:lightbox"));
    }

    if (lightbox) {
        lbClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
        });
    }


    /* ---------------------------------------------------
       7. Showcases (one per category)
       --------------------------------------------------- */
    $$("[data-showcase]").forEach(function (root) {
        var slides = PROJECTS[root.getAttribute("data-showcase")];
        if (!slides || !slides.length) return;

        var media = $(".pj-media", root);
        var img = $(".pj-img", root);
        var info = $(".pj-info", root);
        var counter = $(".pj-counter", root);
        var bar = $(".pj-bar i", root);
        var dotsWrap = $(".pj-dots", root);
        var prevBtn = $(".pj-prev", root);
        var nextBtn = $(".pj-next", root);

        var index = 0;
        var inView = false;
        var hovering = false;

        /* dots */
        var dots = slides.map(function (_, i) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Show project " + (i + 1));
            dot.addEventListener("click", function () { show(i); });
            dotsWrap.appendChild(dot);
            return dot;
        });

        function fillText(s) {
            $(".pj-title", root).textContent = s.title;
            $(".pj-desc", root).textContent = s.description;
            $(".pj-focus", root).textContent = s.focus;
            $(".pj-role", root).textContent = s.role;
            $(".pj-approach", root).textContent = s.approach;
        }

        function restartBar() {
            if (!bar) return;
            bar.style.animation = "none";
            void bar.offsetWidth;
            bar.style.animation = "";
        }

        function swapImage(s) {
            var triedFallback = false;
            img.classList.add("is-swap");

            setTimeout(function () {
                img.onload = function () { img.classList.remove("is-swap"); };
                img.onerror = function () {
                    if (!triedFallback && slides[0].image !== s.image) {
                        triedFallback = true;
                        img.src = slides[0].image;
                    } else {
                        img.classList.remove("is-swap");
                    }
                };
                img.alt = s.alt;
                img.src = s.image;
            }, 220);
        }

        function show(i) {
            index = (i + slides.length) % slides.length;
            var s = slides[index];

            fillText(s);
            counter.textContent = pad(index + 1) + " / " + pad(slides.length);
            dots.forEach(function (d, n) { d.classList.toggle("active", n === index); });

            if (index !== 0 || root.getAttribute("data-started")) { swapImage(s); }
            root.setAttribute("data-started", "1");

            info.classList.remove("swap");
            void info.offsetWidth;
            info.classList.add("swap");

            restartBar();
        }

        /* initial state: HTML already shows slide 1 */
        counter.textContent = pad(1) + " / " + pad(slides.length);
        dots[0].classList.add("active");

        prevBtn.addEventListener("click", function () { show(index - 1); });
        nextBtn.addEventListener("click", function () { show(index + 1); });

        /* autoplay: progress bar finishing = next slide */
        function syncPlay() {
            var go = inView && !hovering && !document.hidden && !reduceMotion && !body.classList.contains("pj-lb-open");
            root.style.setProperty("--pj-play", go ? "running" : "paused");
        }

        if (bar) { bar.addEventListener("animationend", function () { show(index + 1); }); }

        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
                syncPlay();
            }, { threshold: 0.45 }).observe(root);
        }

        ["mouseenter", "focusin"].forEach(function (ev) {
            root.addEventListener(ev, function () { hovering = true; syncPlay(); });
        });
        ["mouseleave", "focusout"].forEach(function (ev) {
            root.addEventListener(ev, function () { hovering = false; syncPlay(); });
        });
        document.addEventListener("visibilitychange", syncPlay);
        document.addEventListener("pj:lightbox", syncPlay);

        /* image parallax */
        if (!reduceMotion) {
            media.addEventListener("mousemove", function (e) {
                var r = media.getBoundingClientRect();
                media.style.setProperty("--px", (((e.clientX - r.left) / r.width) - 0.5) * -16 + "px");
                media.style.setProperty("--py", (((e.clientY - r.top) / r.height) - 0.5) * -12 + "px");
            });
            media.addEventListener("mouseleave", function () {
                media.style.setProperty("--px", "0px");
                media.style.setProperty("--py", "0px");
            });
        }

        /* keyboard + swipe */
        root.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight") { show(index + 1); }
            if (e.key === "ArrowLeft") { show(index - 1); }
        });

        var startX = null;
        root.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
        root.addEventListener("touchend", function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) { show(dx < 0 ? index + 1 : index - 1); }
            startX = null;
        });

        /* click image to enlarge */
        media.addEventListener("click", function () {
            openLightbox(img.currentSrc || img.src, img.alt, $(".pj-title", root).textContent);
        });
    });


    /* ---------------------------------------------------
       8. CTA glow follows the cursor
       --------------------------------------------------- */
    var cta = document.getElementById("pjCta");
    if (cta && !reduceMotion) {
        cta.addEventListener("mousemove", function (e) {
            var r = cta.getBoundingClientRect();
            cta.style.setProperty("--mx", (e.clientX - r.left) + "px");
            cta.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    }

})();