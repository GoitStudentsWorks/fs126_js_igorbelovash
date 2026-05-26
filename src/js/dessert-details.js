// desetrt-modal-details

import axios from 'axios';

let currentDessertId = null;

const dessertContainer = document.querySelector('.js-dessert-grid');
const overlay = document.querySelector('.overlay-details');
const modalCloseBtn = document.querySelector('.modal-details-close');

const modalImg = document.querySelector('.modal-img');
const modalTitle = document.querySelector('.modal-details-title');
const modalPrice = document.querySelector('.modal-price');
const modalRating = document.querySelector('.modal-rating');
const modalDescription = document.querySelector('.modal-description');
const modalIngredients = document.querySelector('.modal-ingredients');

function generateStars(rating) {
  const numericRating = Number(rating) || 5;
  const totalStars = 5;

  const fullStarsCount = Math.floor(numericRating);
  const hasHalfStar = (numericRating % 1) >= 0.25 && (numericRating % 1) < 0.75;
  const extraFullStar = (numericRating % 1) >= 0.75 ? 1 : 0;

  const finalFullStars = fullStarsCount + extraFullStar;
  const emptyStarsCount = totalStars - finalFullStars - (hasHalfStar ? 1 : 0);

  return '★'.repeat(finalFullStars) + (hasHalfStar ? '⯪' : '') + '☆'.repeat(emptyStarsCount);
}

async function handleDessertClick(event) {
   const targetBtn = event.target.closest('.product-card-btn');
    if (!targetBtn) return;

    const { id } = targetBtn.dataset;

    currentDessertId = id;
    try {
        const response = await axios.get(`https://your-api.com/desserts/${id}`);
        const dessert = response.data;

        modalImg.src = dessert.image;
        modalImg.alt = dessert.name;
        modalTitle.textContent = dessert.name;
        modalPrice.textContent = `${dessert.price} грн`;
        modalDescription.textContent = dessert.description;
        modalRating.textContent = generateStars(dessert.rating);
        modalIngredients.innerHTML = `<strong>Склад:</strong> ${dessert.ingredients}`;

        openModal();
    } catch (error) {
        console.error(`Failed to load dessert:`, error);
    }

}

function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    modalCloseBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', handleBackdropClick)
    window.addEventListener('keydown', handleEscapeKey);
}

function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';

    modalCloseBtn.removeEventListener('click', closeModal);
    overlay.removeEventListener('click', handleBackdropClick);
    window.removeEventListener('keydown', handleEscapeKey);

    clearModal();

    currentDessertId = null;
}

function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeModal();
}

function handleEscapeKey(event) {
    if (event.code === 'Escape') closeModal();
}

if (dessertContainer) {
  dessertContainer.addEventListener('click', handleDessertClick);
}

const openOrderBtn = document.querySelector('.js-open-order-btn');

if (openOrderBtn) {
    openOrderBtn.addEventListener('click', () => {

        if (!currentDessertId) return;
        
    const orderEvent = new CustomEvent('open-order', {
      detail: { dessertId: currentDessertId }
    });

    document.dispatchEvent(orderEvent);    

        console.log(`Подія 'open-order' відправлена з ID: ${currentDessertId}`);
        
    closeModal();
  });
}

function clearModal() {
    if (modalImg) { modalImg.removeAttribute('src'); modalImg.alt = ''; }
    if (modalTitle) modalTitle.textContent = '';
    if (modalPrice) modalPrice.textContent = '';
    if (modalDescription) modalDescription.textContent = '';
    if (modalRating) modalRating.textContent = '';
    if (modalIngredients) modalIngredients.innerHTML = '';
}






