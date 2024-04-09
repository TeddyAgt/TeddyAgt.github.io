// Gestion du menu de navigaton mobile
const toggleMenuBtn = document.querySelector(".toggle-menu-btn");
const navigationMenu = document.querySelector(".navigation");
let isMenuVisible = false;

toggleMenuBtn.addEventListener("click", toggleNavigationMenu);

function toggleNavigationMenu() {
  navigationMenu.classList.toggle("visible");
  isMenuVisible = !isMenuVisible;
  if (isMenuVisible) {
    toggleMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    toggleMenuBtn.ariaLabel = "Fermer le menu de navigation";
  } else {
    toggleMenuBtn.innerHTML =
      '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    toggleMenuBtn.ariaLabel = "Ouvrir le menu de navigation";
  }
}

// Gestion des accordéons expérience pro
const accordionTogglers = document.querySelectorAll(".details-toggler");

accordionTogglers.forEach((toggler) =>
  toggler.addEventListener("click", handleAccordions, {
    capture: true,
  })
);

function handleAccordions(e) {
  e.target.nextElementSibling.classList.toggle("expanded");
  e.target.lastElementChild.classList.toggle("details-toggler__chevron--up");
}
