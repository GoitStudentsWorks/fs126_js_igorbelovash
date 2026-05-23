// desetrt-modal-details
let currentDessertId = null;

const dessertContainer = document.querySelector('.desserts-list');
const overlay = document.querySelector('.overlay-details');
const modalCloseBtn = document.querySelector('.modal-close');

const modalImg = document.querySelector('.modal-img');
const modalTitle = document.querySelector('.modal-title');
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

function handleDessertClick(event) {
    const targetBtn = event.target.closest('.product-card-btn');
    if (!targetBtn) return;

    const {
        id,
        name,
        description,
        image,
        price,
        ingredients,
        rating
    } = targetBtn.dataset;

    currentDessertId = id;

    if (modalImg) {
        modalImg.src = image;
        modalImg.alt = name;
    }
    if (modalTitle) modalTitle.textContent = name;
    if (modalPrice) modalPrice.textContent = `${price} грн`;
    if (modalDescription) modalDescription.textContent = description;
    if (modalRating) modalRating.textContent = generateStars(rating);
    if (modalIngredients) modalIngredients.innerHTML = `<strong>Склад:</strong> ${ingredients}`;

    openModal()
}

function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    modalCloseBtn.add('click', closeModal);
    overlay.addEventListener('click', handleBackdropClick);
    window.addEventListener('keydown', handleEscapeKey);
}

function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = ''; 
 
    modalCloseBtn.removeEventListener('click', closeModal);
    overlay.removeEventListener('click', handleBackdropClick);
    window.removeEventListener('keydown', handleEscapeKey);

    currentDessertId = null;
}

function handleBackdropClick(event) {
    if (event.target === overlay) closeModal();
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

    closeModal(); 

    const orderEvent = new CustomEvent('open-order', {
      detail: { dessertId: currentDessertId }
    });

    document.dispatchEvent(orderEvent);
    
    console.log(`Подія 'open-order' відправлена з ID: ${currentDessertId}`);
  });
}






