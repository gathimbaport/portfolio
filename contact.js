/* =========================================================
   contact.js  |  QS Gathimba
   Standalone: menu, progress, reveal, form, copy, FAQ, hours.
   >>> Edit the CONFIG block below with your real details. <<<
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------
       CONFIG – change these, everything else updates itself
       --------------------------------------------------- */
    var CONFIG = {
        email: "qsgathimba@gmail.com",
        phoneDisplay: "+254 712387491",
        phoneLink: "+254712387491",          /* digits only, with country code */
        whatsapp: "254712387491",            /* digits only, no + sign */

        /* Optional: paste a form endpoint (e.g. Formspree "https://formspree.io/f/xxxx").
           Leave empty to open the visitor's email app with the message filled in. */
        formEndpoint: "",

        timeZone: "Africa/Nairobi",
        openHour: 8,                         /* Monday–Friday opening */
        closeHour: 17                        /* Monday–Friday closing */
    };

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }


    /* ---------------------------------------------------
       1. Site chrome: header, progress, menu, reveal
       --------------------------------------------------- */
    var siteHeader = document.getElementById("siteHeader");
    var progress = document.getElementById("pageProgress");
    var menuToggle = document.getElementById("menuToggle");
    var mainNav = document.getElementById("mainNav");

    function onScroll() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) { progress.style.setProperty("--p", max > 0 ? Math.min(window.scrollY / max, 1) : 0); }
        if (siteHeader) { siteHeader.classList.toggle("scrolled", window.scrollY > 10); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setHeaderHeight() {
        if (siteHeader) {
            document.documentElement.style.setProperty("--pj-header-h", siteHeader.offsetHeight + "px");
        }
    }
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
    window.addEventListener("load", setHeaderHeight);

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

    /* hero reveal, staggered */
    $$(".reveal").forEach(function (el, i) {
        setTimeout(function () { el.classList.add("in"); }, reduceMotion ? 0 : 100 + i * 120);
    });

    /* scroll reveal */
    var fx = $$(".ct-fx");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
            });
        }, { threshold: 0.15 });
        fx.forEach(function (el) { io.observe(el); });
    } else {
        fx.forEach(function (el) { el.classList.add("in"); });
    }

    /* cursor glow on hero + closing band */
    function glow(el) {
        if (!el || reduceMotion) return;
        el.addEventListener("mousemove", function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty("--mx", (e.clientX - r.left) + "px");
            el.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    }
    glow($(".ct-hero"));
    glow(document.getElementById("ctBand"));


    /* ---------------------------------------------------
       2. Toast
       --------------------------------------------------- */
    var toast = document.getElementById("ctToast");
    var toastTimer = null;
    function showToast(text) {
        if (!toast) return;
        toast.textContent = text;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2000);
    }


    /* ---------------------------------------------------
       3. Fill contact details from CONFIG
       --------------------------------------------------- */
    $$('[data-ct="mail-link"]').forEach(function (a) { a.href = "mailto:" + CONFIG.email; });
    $$('[data-ct="mail-text"]').forEach(function (a) { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
    $$('[data-ct="phone-text"]').forEach(function (a) { a.href = "tel:" + CONFIG.phoneLink; a.textContent = CONFIG.phoneDisplay; });
    $$('[data-ct="whatsapp-link"]').forEach(function (a) {
        a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hello, I would like to discuss a project.");
    });


    /* ---------------------------------------------------
       4. Copy buttons
       --------------------------------------------------- */
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.cssText = "position:fixed;left:-9999px;top:0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy") ? resolve() : reject(); } catch (err) { reject(err); }
            document.body.removeChild(ta);
        });
    }

    $$(".ct-copy").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var kind = btn.getAttribute("data-copy");
            var value = kind === "email" ? CONFIG.email : CONFIG.phoneDisplay;
            copyText(value).then(function () {
                btn.textContent = "Copied";
                btn.classList.add("done");
                showToast((kind === "email" ? "Email" : "Phone number") + " copied");
                setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1800);
            }).catch(function () { showToast("Press Ctrl+C to copy: " + value); });
        });
    });


    /* ---------------------------------------------------
       5. Working hours: open / closed + highlight today
       --------------------------------------------------- */
    (function hours() {
        var label = document.getElementById("ctOpenState");
        var rows = $$(".ct-hours li");
        if (!label) return;

        try {
            var parts = new Intl.DateTimeFormat("en-GB", {
                timeZone: CONFIG.timeZone, weekday: "short", hour: "numeric", hour12: false
            }).formatToParts(new Date());

            var day = "", hour = 0;
            parts.forEach(function (p) {
                if (p.type === "weekday") day = p.value;
                if (p.type === "hour") hour = parseInt(p.value, 10) % 24;
            });

            var weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(day) !== -1;
            var open = weekday && hour >= CONFIG.openHour && hour < CONFIG.closeHour;

            label.textContent = open ? "Open now" : "Closed right now";
            label.style.color = open ? "var(--pj-accent)" : "";

            var idx = weekday ? 0 : (day === "Sat" ? 1 : 2);
            if (rows[idx]) { rows[idx].classList.add("today"); }
        } catch (err) { /* keep the default text */ }
    })();


    /* ---------------------------------------------------
       6. FAQ accordion
       --------------------------------------------------- */
    $$(".ct-faq-item").forEach(function (item) {
        var btn = $("button", item);
        btn.addEventListener("click", function () {
            var open = !item.classList.contains("open");
            item.classList.toggle("open", open);
            btn.setAttribute("aria-expanded", open ? "true" : "false");
        });
    });
    var firstFaq = $(".ct-faq-item");
    if (firstFaq) {
        firstFaq.classList.add("open");
        $("button", firstFaq).setAttribute("aria-expanded", "true");
    }


    /* ---------------------------------------------------
       7. Enquiry form
       --------------------------------------------------- */
    var form = document.getElementById("ctForm");
    if (!form) return;

    var panel = form.closest(".ct-panel");
    var fName = document.getElementById("ctName");
    var fEmail = document.getElementById("ctEmail");
    var fPhone = document.getElementById("ctPhone");
    var fMessage = document.getElementById("ctMessage");
    var fStage = document.getElementById("ctStage");
    var fHoney = document.getElementById("ctCompany");
    var counter = document.getElementById("ctCount");
    var statusEl = document.getElementById("ctStatus");
    var sendBtn = document.getElementById("ctSend");
    var success = document.getElementById("ctSuccess");
    var successTitle = document.getElementById("ctSuccessTitle");
    var successText = document.getElementById("ctSuccessText");
    var lastMessage = "";

    function setError(input, errId, msg) {
        var field = input.closest(".ct-field");
        var out = document.getElementById(errId);
        field.classList.toggle("invalid", !!msg);
        out.textContent = msg || "";
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        return !msg;
    }

    var checks = {
        name: function () {
            var v = fName.value.trim();
            return setError(fName, "ctNameErr", v.length < 2 ? "Please enter your full name." : "");
        },
        email: function () {
            var v = fEmail.value.trim();
            var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
            return setError(fEmail, "ctEmailErr", ok ? "" : "Please enter a valid email address.");
        },
        phone: function () {
            var v = fPhone.value.trim();
            var digits = v.replace(/\D/g, "");
            var ok = v === "" || (digits.length >= 9 && digits.length <= 15 && /^[+\d\s()-]+$/.test(v));
            return setError(fPhone, "ctPhoneErr", ok ? "" : "Enter a valid phone number, or leave it blank.");
        },
        message: function () {
            var v = fMessage.value.trim();
            return setError(fMessage, "ctMessageErr", v.length < 15 ? "Please share a few details (at least 15 characters)." : "");
        }
    };

    fName.addEventListener("blur", checks.name);
    fEmail.addEventListener("blur", checks.email);
    fPhone.addEventListener("blur", checks.phone);
    fMessage.addEventListener("blur", checks.message);

    [[fName, "name"], [fEmail, "email"], [fPhone, "phone"], [fMessage, "message"]].forEach(function (pair) {
        pair[0].addEventListener("input", function () {
            if (pair[0].closest(".ct-field").classList.contains("invalid")) { checks[pair[1]](); }
        });
    });

    fMessage.addEventListener("input", function () { counter.textContent = fMessage.value.length; });

    function buildMessage() {
        var service = (form.querySelector('input[name="service"]:checked') || {}).value || "";
        return [
            "Name: " + fName.value.trim(),
            "Email: " + fEmail.value.trim(),
            "Phone: " + (fPhone.value.trim() || "Not provided"),
            "Project type: " + service,
            "Project stage: " + fStage.value,
            "",
            fMessage.value.trim()
        ].join("\n");
    }

    function showSuccess(title, text) {
        successTitle.textContent = title;
        successText.textContent = text;
        panel.classList.add("is-sent");
        success.hidden = false;
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }

    function setLoading(on) {
        sendBtn.classList.toggle("loading", on);
        sendBtn.disabled = on;
        $("b", sendBtn).textContent = on ? "Sending…" : "Send enquiry";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        statusEl.textContent = "";
        statusEl.classList.remove("error");

        /* bots fill the hidden field: pretend success and stop */
        if (fHoney.value) { showSuccess("Thank you.", "Your enquiry has been received."); return; }

        var ok = [checks.name(), checks.email(), checks.phone(), checks.message()].every(Boolean);
        if (!ok) {
            var firstBad = form.querySelector(".ct-field.invalid input, .ct-field.invalid textarea");
            if (firstBad) { firstBad.focus(); }
            statusEl.textContent = "Please fix the highlighted fields and try again.";
            statusEl.classList.add("error");
            return;
        }

        var service = (form.querySelector('input[name="service"]:checked') || {}).value || "Project";
        var subject = "Project enquiry: " + service + " (" + fName.value.trim() + ")";
        lastMessage = buildMessage();
        setLoading(true);

        if (CONFIG.formEndpoint) {
            /* send straight from the page */
            fetch(CONFIG.formEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name: fName.value.trim(),
                    email: fEmail.value.trim(),
                    phone: fPhone.value.trim(),
                    service: service,
                    stage: fStage.value,
                    message: fMessage.value.trim(),
                    _subject: subject
                })
            }).then(function (res) {
                if (!res.ok) { throw new Error("Request failed"); }
                setLoading(false);
                showSuccess("Thank you, " + fName.value.trim().split(" ")[0] + ".", "Your enquiry has been sent. I will review it and get back to you.");
            }).catch(function () {
                setLoading(false);
                statusEl.textContent = "Something went wrong sending your message. Please email " + CONFIG.email + " instead.";
                statusEl.classList.add("error");
            });
        } else {
            /* no endpoint set: open the visitor's email app, pre-filled */
            var href = "mailto:" + CONFIG.email +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(lastMessage);

            setTimeout(function () {
                window.location.href = href;
                setLoading(false);
                showSuccess(
                    "Almost done, " + fName.value.trim().split(" ")[0] + ".",
                    "Your email app should open with the message ready to send. If nothing opens, copy your message below and email it to " + CONFIG.email + "."
                );
            }, reduceMotion ? 0 : 450);
        }
    });

    document.getElementById("ctCopyMsg").addEventListener("click", function () {
        copyText(lastMessage || buildMessage())
            .then(function () { showToast("Message copied"); })
            .catch(function () { showToast("Could not copy automatically"); });
    });

    document.getElementById("ctAnother").addEventListener("click", function () {
        form.reset();
        counter.textContent = "0";
        $$(".ct-field.invalid", form).forEach(function (f) { f.classList.remove("invalid"); });
        success.hidden = true;
        panel.classList.remove("is-sent");
        fName.focus();
    });

})();