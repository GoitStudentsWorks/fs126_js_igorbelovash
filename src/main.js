import './js/dessert-list.js';

// burger menu
const burger = document.getElementById("burgerBtn");
const closeBtn = document.getElementById("closeBtn");
const mobileMenu = document.getElementById("mobileMenu");
const links = document.querySelectorAll(".mobile-link");

// відкрити
burger.addEventListener("click", () => {
  mobileMenu.classList.add("open");
  document.body.classList.add("menu-open");
});

// закрити функція
function closeMenu() {
  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
}

// закрити по X
closeBtn.addEventListener("click", closeMenu);

// закрити по кліку на пункт
links.forEach(link => {
  link.addEventListener("click", closeMenu);
});

// закрити по ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
    closeMenu();
  }
});