import './js/dessert-list.js';

// burger menu
const burger = document.getElementById("burgerBtn");
const closeBtn = document.getElementById("closeBtn");

const mobileMenu = document.getElementById("mobileMenu");

const links = document.querySelectorAll(".mobile-link");

// відкрити
burger.addEventListener("click", () => {
  mobileMenu.classList.add("open");
});

// закрити по X
closeBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
});

// закрити по кліку на пункт
links.forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});