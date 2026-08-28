const openArticle = document.getElementById("openArticle");
const closeArticle = document.getElementById("closeArticle");
const fullArticle = document.getElementById("fullArticle");
const articlesSection = document.getElementById("articles");

openArticle.addEventListener("click", () => {
    articlesSection.style.display = "none";
    fullArticle.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

closeArticle.addEventListener("click", () => {
    fullArticle.style.display = "none";
    articlesSection.style.display = "block";

    window.scrollTo({
        top: articlesSection.offsetTop - 80,
        behavior: "smooth"
    });
});
