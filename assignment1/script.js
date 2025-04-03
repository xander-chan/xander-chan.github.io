// When the page is scrolled, execute this function
window.onscroll = function () {
  // Select the element with the class "up-arrow"
  var upArrow = document.querySelector(".up-arrow");

  // If the user has scrolled more than 200 pixels down from the top...
  if (
    document.body.scrollTop > 200 || // Necessary code for this to function? Had to ask google for help
    document.documentElement.scrollTop > 200
  ) {
    // Add the visible class to show the up arrow
    upArrow.classList.add("visible");
  } else {
    // Remove the visible class to hide the up arrow
    upArrow.classList.remove("visible");
  }
};

// Wait until the page content is fully loaded before executing this
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the class 'fade-in' (my questions)
  const fadeElements = document.querySelectorAll(".fade-in");

  // Options for the observer
  const options = {
    threshold: 0.5, // The effect triggers when 50% of the element is on screen
  };

  // Create an IntersectionObserver to track elements entering the viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // If an element is visible...
      if (entry.isIntersecting) {
        // Add the "visible" class to trigger the fade-in effect
        entry.target.classList.add("visible");
        // Stop observing this element since it has already been done
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Apply the observer to each element with the "fade-in" class
  fadeElements.forEach((element) => {
    observer.observe(element);
  });
});

// Wait until the page content is fully loaded before running this code
document.addEventListener("DOMContentLoaded", function () {
  // Change the cursor to a custom cursor image ("bambcursor.cur"), had to use javascript as was having constant problems with CSS overriding something and I wanted a bamboo cursor to match the theme
  document.body.style.cursor = "url('bambcursor.cur'), auto";
});
