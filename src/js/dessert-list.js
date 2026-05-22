import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  getCategories,
  getDesserts,
} from './services/api/api.js';


let currentPage = 1;
let currentCategory = '';
let totalItems = 0;
const PAGE_LIMIT = 8;


const dessertGrid = document.querySelector('.js-dessert-grid');
const dessertLoader = document.querySelector('.js-dessert-loader');
const loadMoreBtn = document.querySelector('.js-load-more');
const categoriesList = document.querySelector('.js-categories');
const categorySelect = document.querySelector('.js-category-select');



function renderDessertCard(dessert) {
  return `
    <li class="dessert-card" data-id="${dessert._id}">
      <div class="dessert-card__img-wrap">
        <img
          class="dessert-card__img"
          src="${dessert.image}"
          alt="${dessert.name}"
          loading="lazy"
        >
      </div>
      <div class="dessert-card__body">
        <p class="dessert-card__category">${dessert.category?.name || 'No category'}</p>
        <h3 class="dessert-card__name">${dessert.name}</h3>

        <div class="dessert-card__description">
          <span>${dessert.description}</span>
        </div>

        <div class="dessert-card__footer">
          <span class="dessert-card__price">${Number(dessert.price).toFixed(0)} грн </span>
            <button type="button" class="dessert-card__btn" aria-label="Відкрити">
              <svg width="20" height="20">
                <use href="./img/sprite.svg#icon-arrow-up-right"></use>
              </svg>
            </button>
        </div>
      </div>
    </li>
  `;
}


async function loadDesserts({ reset = false } = {}) {
  if (reset) {
    currentPage = 1;
    dessertGrid.innerHTML = '';
  }

  showLoader(dessertLoader);
  loadMoreBtn.hidden = true;

  try {
    const data = await getDesserts({ page: currentPage, limit: PAGE_LIMIT, category: currentCategory });
    totalItems = data.totalItems;
    const items = data.desserts ?? data;

    dessertGrid.insertAdjacentHTML('beforeend', items.map(renderDessertCard).join(''));

    const shown = dessertGrid.querySelectorAll('.dessert-card').length;
    loadMoreBtn.hidden = shown >= totalItems;
  } catch {
    iziToast.error({ title: 'Error', message: 'Failed to load desserts. Please try again.' });
  } finally {
    hideLoader(dessertLoader);
  }
}

function showLoader(el) { el && el.removeAttribute('hidden'); }
function hideLoader(el) { el && el.setAttribute('hidden', ''); }


async function loadCategories() {
  try {
    const cats = await getCategories();


    const allBtn = `<li><button type="button" class="dessert-list__cat-btn is-active" data-cat="">Всі десерти</button></li>`;
    categoriesList.insertAdjacentHTML('beforeend', allBtn + cats.map(c =>
      `<li><button type="button" class="dessert-list__cat-btn" data-cat="${c._id}">${c.name}</button></li>`
    ).join(''));

  
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c._id;
      opt.textContent = c.name;
      categorySelect.appendChild(opt);
    });
  } catch {
  }
}

categoriesList?.addEventListener('click', e => {
  const btn = e.target.closest('.dessert-list__cat-btn');
  if (!btn) return;
  categoriesList.querySelectorAll('.dessert-list__cat-btn').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  currentCategory = btn.dataset.cat;
  loadDesserts({ reset: true });
});

categorySelect?.addEventListener('change', e => {
  currentCategory = e.target.value;
  loadDesserts({ reset: true });
});

loadMoreBtn?.addEventListener('click', () => {
  currentPage += 1;
  loadDesserts();
});


(async () => {
  await loadCategories();
  await loadDesserts({ reset: true });
})();
