const animatedElements = document.querySelectorAll(".animate");

window.addEventListener("scroll", () => {
  animatedElements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      el.style.animation = "fadeIn 1.5s ease forwards";
    }
  });
});
let currentSlide = 0;

function slideRight() {
  const track = document.getElementById("sliderTrack");
  const slides = document.querySelectorAll(".slide");
  const slideWidth = slides[0].offsetWidth + 30;

  if (currentSlide < slides.length - 3) {
    currentSlide++;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }
}

function slideLeft() {
  const track = document.getElementById("sliderTrack");

  if (currentSlide > 0) {
    currentSlide--;
    track.style.transform = `translateX(-${currentSlide * (track.children[0].offsetWidth + 30)}px)`;
  }
}

/* AUTO SLIDE */
setInterval(() => {
  slideRight();
}, 5000);
