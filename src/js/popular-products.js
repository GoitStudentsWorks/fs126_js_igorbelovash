import axios from 'axios';
import iziToast from 'izitoast';
import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';

import 'izitoast/dist/css/iziToast.min.css';
import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = 'https://deserts-store.b.goit.study/api/';
const END_POINT = 'desserts';

const productsSection = document.querySelector('.popular-products-section');
const productsContainer = document.querySelector('.popular-products-list');

function showWarning(message) {
  iziToast.warning({
    title: 'Увага',
    message,
    position: 'topRight',
  });
}

function showError(message) {
  iziToast.error({
    title: 'Помилка',
    message,
    position: 'topRight',
  });
}

function showProductsLoading() {
  productsSection.classList.remove('is-hidden');
  productsSection.classList.add('is-loading');
  productsContainer.innerHTML = '';
}

function showProductsSection() {
  productsSection.classList.remove('is-hidden', 'is-loading');
}

function hideProductsSection() {
  productsSection.classList.add('is-hidden');
  productsSection.classList.remove('is-loading');
  productsContainer.innerHTML = '';
}

function getProductId(product) {
  return product.id || product._id;
}

function createMarkup(arr, options = {}) {
  if (!Array.isArray(arr)) return '';

  const { slide = false } = options;
  const cardClass = slide ? 'product-card swiper-slide' : 'product-card';

  return arr
    .map(product => {
      const { image, category, name, description, price } = product;
      const productId = getProductId(product);
      const categoryName = category.name;

      return `<li class="${cardClass}" data-id="${productId}">
          <div class="product-img-thumb">
            <img class="product-img" src="${image}" alt="${name}"/>
          </div>
          <p class="product-category">${categoryName}</p>
          <h4 class="product-name">${name}</h4>
          <p class="product-description">${description}</p>
          <div class="product-card-bottom">
            <p class="product-price">${price} грн</p>
            <button class="product-card-btn" type="button" aria-label="Open product details">
              <svg class="product-card-svg" width="24" height="24">
                <use href="/img/sprite.svg#icon-arrow_outward">
                </use>
              </svg>
            </button>
          </div>
        </li>`;
    })
    .join('');
}

async function getPopularProducts() {
  if (!productsSection || !productsContainer) {
    return;
  }

  showProductsLoading();

  try {
    const { data } = await axios(`${BASE_URL}${END_POINT}`, {
      params: {
        type: 'popular',
      },
    });
    if (!Array.isArray(data.desserts)) {
      throw new Error('Невірний формат даних з API');
    }
    if (data.desserts.length < 3) {
      hideProductsSection();
      showWarning('Мало популярних товарів для відображення');
      return;
    }

    const validDesserts = data.desserts.filter(product => {
      const { image, category, name, description, price } = product;

      return (
        getProductId(product) &&
        image &&
        category?.name &&
        name &&
        description &&
        price !== undefined &&
        price !== null &&
        price !== ''
      );
    });

    if (validDesserts.length < 3) {
      hideProductsSection();
      showWarning('Неможливо відобразити популярні товари через неповні дані');
      return;
    }

    productsContainer.innerHTML = createMarkup(validDesserts, { slide: true });
    showProductsSection();
    initPopularProductsSwiper();
  } catch (error) {
    hideProductsSection();
    showError(error.message || 'Помилка завантаження популярних товарів');
  }
}

getPopularProducts();

function initPopularProductsSwiper() {
  new Swiper('.popular-products-swiper', {
    modules: [Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 24,
    watchOverflow: true,
    pagination: {
      el: '.popular-products-pagination',
      dynamicBullets: true,
      clickable: true,
    },
    navigation: {
      nextEl: '.popular-btn-next',
      prevEl: '.popular-btn-prev',
      disabledClass: 'popular-btn-disabled',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}
