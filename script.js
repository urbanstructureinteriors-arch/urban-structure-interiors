const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const siteHeader = document.querySelector(".site-header");

const updateHeaderOnScroll = () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const slideshow = document.querySelector("[data-slideshow]");

if (slideshow) {
  const track = slideshow.querySelector(".slideshow-track");
  const slides = Array.from(track.querySelectorAll(".slideshow-slide"));
  const dots = Array.from(slideshow.querySelectorAll(".slideshow-dot"));
  const slideNumber = slideshow.querySelector("[data-slide-number]");
  const slideCaption = slideshow.querySelector("[data-slide-caption]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let timer = null;
  let isHovered = false;
  let hasFocus = false;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    slideNumber.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    slideCaption.textContent = slides[activeIndex].dataset.caption;

    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== activeIndex));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      if (dotIndex === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const syncAutoplay = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }

    if (!reducedMotion.matches && !document.hidden && !isHovered && !hasFocus) {
      timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }
  };

  slideshow.querySelector("[data-previous]").addEventListener("click", () => {
    showSlide(activeIndex - 1);
    syncAutoplay();
  });

  slideshow.querySelector("[data-next]").addEventListener("click", () => {
    showSlide(activeIndex + 1);
    syncAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      syncAutoplay();
    });
  });

  slideshow.addEventListener("pointerenter", () => {
    isHovered = true;
    syncAutoplay();
  });

  slideshow.addEventListener("pointerleave", () => {
    isHovered = false;
    syncAutoplay();
  });

  slideshow.addEventListener("focusin", () => {
    hasFocus = true;
    syncAutoplay();
  });

  slideshow.addEventListener("focusout", (event) => {
    if (!slideshow.contains(event.relatedTarget)) {
      hasFocus = false;
      syncAutoplay();
    }
  });

  document.addEventListener("visibilitychange", syncAutoplay);
  reducedMotion.addEventListener("change", syncAutoplay);
  showSlide(activeIndex);
  syncAutoplay();
}
