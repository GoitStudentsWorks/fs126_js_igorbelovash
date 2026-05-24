import axios from 'axios';
import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';

import { createMarkup } from './utils/createMarkupForProductCard';
import 'swiper/css';
import 'swiper/css/pagination';

const BASE_URL = 'https://deserts-store.b.goit.study/api/';
const END_POINT = 'desserts';

const productsContainer = document.querySelector('.popular-products-list');

async function getPopularProducts() {
  if (!productsContainer) {
    return;
  }

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
      console.warn('Мало популярних товарів для відображення');
      return;
    }

    const validDesserts = data.desserts.filter(
      ({ image, category, name, description, price }) =>
        image && category?.name && name && description && price
    );

    if (validDesserts.length < 3) {
      console.warn('Неможливо відобразити популярні товари через неповні дані');
      return;
    }

    productsContainer.innerHTML = createMarkup(validDesserts, { slide: true });
    initPopularProductsSwiper();
  } catch (error) {
    console.error('Помилка завантаження популярних товарів:', error);
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
