// When the page is scrolled I want it to do something
window.onscroll = function () {
  var upArrow = document.querySelector(".up-arrow");

  // Show the up arrow after scrolling down 200pixels
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    upArrow.classList.add("visible");
  } else {
    upArrow.classList.remove("visible");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const fadeElements = document.querySelectorAll(".fade-in");

  const options = {
    threshold: 0.5, // Trigger when 50% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible"); // Add visible class when in viewport
        observer.unobserve(entry.target); // Stop observing after the element is in view
      }
    });
  }, options);

  fadeElements.forEach((element) => {
    observer.observe(element); // Observe each fade-in element
  });
});
