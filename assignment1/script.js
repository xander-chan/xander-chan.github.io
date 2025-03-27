// JavaScript for scroll effects or interactive features
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section");
  const scrollPosition = window.scrollY;

  sections.forEach(function (section) {
    if (scrollPosition + window.innerHeight > section.offsetTop + 100) {
      section.classList.add("visible");
    }
  });
});
