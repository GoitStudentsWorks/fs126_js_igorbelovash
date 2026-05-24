import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getCategories, getDesserts } from './services/api/api.js';

let state = {
  page: 1,
  category: '',
  total: 0,
  loading: false,
};

const PAGE_LIMIT = 8;

const els = {
  grid: document.querySelector('.js-dessert-grid'),
  loader: document.querySelector('.js-dessert-loader'),
  loadMore: document.querySelector('.js-load-more'),
  categories: document.querySelector('.js-categories'),
  customSelect: document.querySelector('.js-custom-select'),
};

const trigger = els.customSelect?.querySelector('.custom-select__trigger');
const dropdown = els.customSelect?.querySelector('.custom-select__dropdown');
const label = els.customSelect?.querySelector('.custom-select__label');

function setDropdownOpen(open) {
  els.customSelect?.classList.toggle('open', open);
  trigger?.setAttribute('aria-expanded', String(open));
}

function renderDessertCard(dessert) {
  return `
    <li class="dessert-card" data-id="${dessert._id}">
      <div class="dessert-card__img-wrap">
        <img class="dessert-card__img" src="${dessert.image}" alt="${dessert.name}" loading="lazy">
      </div>
      <div class="dessert-card__body">
        <p class="dessert-card__category">${dessert.category?.name || 'No category'}</p>
        <h3 class="dessert-card__name">${dessert.name}</h3>
        <div class="dessert-card__description">
          <span>${dessert.description}</span>
        </div>
        <div class="dessert-card__footer">
          <span class="dessert-card__price">${Number(dessert.price).toFixed(0)} грн</span>
          <button type="button" class="dessert-card__btn" aria-label="Відкрити">
            <svg width="20" height="20">
              <use href="/img/sprite.svg#icon-arrow_outward"></use>
            </svg>
          </button>
        </div>
      </div>
    </li>
  `;
}

function renderCustomOptions(cats) {
  if (!dropdown) return;

  dropdown.innerHTML = [
    `<li class="custom-select__option is-active" data-cat="">Всі десерти</li>`,
    ...cats.map(c =>
      `<li class="custom-select__option" data-cat="${c._id}">${c.name}</li>`
    )
  ].join('');
}

function renderCategoryButtons(cats) {
  if (!els.categories) return;

  els.categories.innerHTML = [
    `<li>
      <button class="dessert-list__cat-btn is-active" data-cat="">
        Всі десерти
      </button>
    </li>`,
    ...cats.map(c => `
      <li>
        <button class="dessert-list__cat-btn" data-cat="${c._id}">
          ${c.name}
        </button>
      </li>
    `)
  ].join('');
}

const ui = {
  showLoader() {
    els.loader?.removeAttribute('hidden');
  },
  hideLoader() {
    els.loader?.setAttribute('hidden', '');
  },
  toggleLoadMore() {
    if (els.loadMore) {
      els.loadMore.hidden = state.page * PAGE_LIMIT >= state.total;
    }
  },
};

async function loadDesserts(reset = false) {
  if (state.loading) return;

  try {
    state.loading = true;

    if (reset) {
      state.page = 1;
      els.grid.innerHTML = '';
    }

    ui.showLoader();
    if (els.loadMore) els.loadMore.hidden = true;

    const data = await getDesserts({
      page: state.page,
      limit: PAGE_LIMIT,
      category: state.category,
    });

    state.total = data.totalItems;
    const items = data.desserts ?? data;

    els.grid.insertAdjacentHTML(
      'beforeend',
      items.map(renderDessertCard).join('')
    );

    ui.toggleLoadMore();
  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load desserts',
    });
  } finally {
    state.loading = false;
    ui.hideLoader();
  }
}

async function loadCategories() {
  try {
    const cats = await getCategories();
    renderCustomOptions(cats);
    renderCategoryButtons(cats);
  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load categories',
    });
  }
}

trigger?.addEventListener('click', () => {
  const isOpen = els.customSelect?.classList.contains('open');
  setDropdownOpen(!isOpen);
});

dropdown?.addEventListener('click', e => {
  const opt = e.target.closest('.custom-select__option');
  if (!opt) return;

  state.category = opt.dataset.cat || '';
  state.page = 1;

  if (label) label.textContent = opt.textContent.trim();

  dropdown.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('is-active'));
  opt.classList.add('is-active');

  loadDesserts(true);
  setDropdownOpen(false);
});

document.addEventListener('click', e => {
  if (!els.customSelect?.contains(e.target)) {
    setDropdownOpen(false);
  }
});

els.categories?.addEventListener('click', e => {
  const btn = e.target.closest('.dessert-list__cat-btn');
  if (!btn) return;

  state.category = btn.dataset.cat || '';
  state.page = 1;

  els.categories.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');

  loadDesserts(true);
});

els.loadMore?.addEventListener('click', () => {
  if (state.loading || state.page * PAGE_LIMIT >= state.total) return;
  state.page += 1;
  loadDesserts();
});

(async function init() {
  await loadCategories();
  await loadDesserts(true);
})();
