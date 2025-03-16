const allLinks = document.querySelectorAll("a");

allLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!document.startViewTransition) {
      setActiveItem(event.target);
      return;
    }

    document.startViewTransition(() => setActiveItem(event.target));
  });
});

function setActiveItem(element) {
  allLinks.forEach((link) => link.classList.remove("active"));
  element.classList.add("active");
}
