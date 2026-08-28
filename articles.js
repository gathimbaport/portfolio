
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

            mainNav.classList.toggle("active");

        });


        /* Close menu when a navigation link is clicked */

        const navLinks =
            mainNav.querySelectorAll("a");


        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mobileMenu.classList.remove("active");

                mainNav.classList.remove("active");

            });

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
       DEBUG MESSAGE
       This confirms that articles.js is loaded.
    ===================================================== */

    console.log("Articles JavaScript loaded successfully.");

});

