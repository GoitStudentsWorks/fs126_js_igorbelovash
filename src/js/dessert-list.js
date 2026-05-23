// import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';
// import {
//   getCategories,
//   getDesserts,
// } from './services/api/api.js';


// let currentPage = 1;
// let currentCategory = '';
// let totalItems = 0;
// const PAGE_LIMIT = 8;


// const dessertGrid = document.querySelector('.js-dessert-grid');
// const dessertLoader = document.querySelector('.js-dessert-loader');
// const loadMoreBtn = document.querySelector('.js-load-more');
// const categoriesList = document.querySelector('.js-categories');
// const customSelect = document.querySelector('.js-custom-select');
// const trigger = customSelect?.querySelector('.custom-select__trigger');
// const dropdown = customSelect?.querySelector('.custom-select__dropdown');

// trigger?.addEventListener('click', () => {
//   customSelect.classList.toggle('open');
// });

// dropdown?.addEventListener('click', e => {
//   const option = e.target.closest('.custom-select__option');
//   if (!option) return;

//   const value = option.dataset.cat;
//   const text = option.textContent;

//   trigger.childNodes[0].nodeValue = text;

//   currentCategory = value;
//   currentPage = 1;

//   loadDesserts({ reset: true });

//   customSelect.classList.remove('open');
// });

// document.addEventListener('click', e => {
//   if (!customSelect?.contains(e.target)) {
//     customSelect?.classList.remove('open');
//   }
// });



// function renderDessertCard(dessert) {
//   return `
//     <li class="dessert-card" data-id="${dessert._id}">
//       <div class="dessert-card__img-wrap">
//         <img
//           class="dessert-card__img"
//           src="${dessert.image}"
//           alt="${dessert.name}"
//           loading="lazy"
//         >
//       </div>
//       <div class="dessert-card__body">
//         <p class="dessert-card__category">${dessert.category?.name || 'No category'}</p>
//         <h3 class="dessert-card__name">${dessert.name}</h3>

//         <div class="dessert-card__description">
//           <span>${dessert.description}</span>
//         </div>

//         <div class="dessert-card__footer">
//           <span class="dessert-card__price">${Number(dessert.price).toFixed(0)} грн </span>
//             <button type="button" class="dessert-card__btn" aria-label="Відкрити">
//               <svg width="20" height="20">
//                 <use href="/img/sprite.svg#icon-arrow_outward"></use>
//               </svg>
//             </button>
//         </div>
//       </div>
//     </li>
//   `;
// }


// function renderCustomOptions(cats) {
//   if (!dropdown) return;

//   dropdown.innerHTML =
//     `<li class="custom-select__option" data-cat="">Всі десерти</li>` +
//     cats.map(c =>
//       `<li class="custom-select__option" data-cat="${c._id}">${c.name}</li>`
//     ).join('');
// }


// async function loadDesserts({ reset = false } = {}) {
//   if (reset) {
//     currentPage = 1;
//     dessertGrid.innerHTML = '';
//   }

//   showLoader(dessertLoader);
//   loadMoreBtn.hidden = true;

//   try {
//     const data = await getDesserts({ page: currentPage, limit: PAGE_LIMIT, category: currentCategory });
//     totalItems = data.totalItems;
//     const items = data.desserts ?? data;

//     dessertGrid.insertAdjacentHTML('beforeend', items.map(renderDessertCard).join(''));

//     const shown = dessertGrid.querySelectorAll('.dessert-card').length;
//     loadMoreBtn.hidden = shown >= totalItems;
//   } catch {
//     iziToast.error({ title: 'Error', message: 'Failed to load desserts. Please try again.' });
//   } finally {
//     hideLoader(dessertLoader);
//   }
// }

// function showLoader(el) { el && el.removeAttribute('hidden'); }
// function hideLoader(el) { el && el.setAttribute('hidden', ''); }


// async function loadCategories() {
//   try {
//     const cats = await getCategories();
//     renderCustomOptions(cats);
    

//     const allBtn = `<li><button type="button" class="dessert-list__cat-btn is-active" data-cat="">Всі десерти</button></li>`;
//     categoriesList.insertAdjacentHTML('beforeend', allBtn + cats.map(c =>
//       `<li><button type="button" class="dessert-list__cat-btn" data-cat="${c._id}">${c.name}</button></li>`
//     ).join(''));

//      } catch (error) {
//     // 👉 обробка помилки
//     iziToast.error({
//       title: 'Error',
//       message: 'Не вдалося завантажити категорії'
//     });
//   }
// }


// categoriesList?.addEventListener('click', e => {
//   const btn = e.target.closest('.dessert-list__cat-btn');
//   if (!btn) return;
//   categoriesList.querySelectorAll('.dessert-list__cat-btn').forEach(b => b.classList.remove('is-active'));
//   btn.classList.add('is-active');
//   currentCategory = btn.dataset.cat;
//   loadDesserts({ reset: true });
// });


// loadMoreBtn?.addEventListener('click', () => {
//   currentPage += 1;
//   loadDesserts();
// });


// (async () => {
//   await loadCategories();
//   await loadDesserts({ reset: true });
// })();

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getCategories, getDesserts } from './services/api/api.js';

let state = {
  page: 1,
  category: '',
  total: 0,
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

function renderDessertCard(d) {
  return `
    <li class="dessert-card" data-id="${d._id}">
      <div class="dessert-card__img-wrap">
        <img class="dessert-card__img" src="${d.image}" alt="${d.name}" loading="lazy">
      </div>
      <div class="dessert-card__body">
        <p class="dessert-card__category">${d.category?.name || 'No category'}</p>
        <h3 class="dessert-card__name">${d.name}</h3>
        <div class="dessert-card__description">
          <span>${d.description}</span>
        </div>
        <div class="dessert-card__footer">
          <span class="dessert-card__price">${Number(d.price).toFixed(0)} грн</span>
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
    `<li class="custom-select__option" data-cat="">Всі десерти</li>`,
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
  toggleLoadMore(shown) {
    if (els.loadMore) els.loadMore.hidden = shown >= state.total;
  },
};

async function loadDesserts(reset = false) {
  try {
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

    ui.toggleLoadMore(els.grid.children.length);
  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load desserts',
    });
  } finally {
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
  els.customSelect?.classList.toggle('open');
});

dropdown?.addEventListener('click', e => {
  const opt = e.target.closest('.custom-select__option');
  if (!opt) return;

  state.category = opt.dataset.cat || '';
  state.page = 1;

  if (label) label.textContent = opt.textContent.trim();

  loadDesserts(true);
  els.customSelect?.classList.remove('open');
});

document.addEventListener('click', e => {
  if (!els.customSelect?.contains(e.target)) {
    els.customSelect?.classList.remove('open');
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
  state.page += 1;
  loadDesserts();
});

(async function init() {
  await loadCategories();
  await loadDesserts(true);
})();