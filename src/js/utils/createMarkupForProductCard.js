export default function createMarkup(arr, options = {}) {
  if (!Array.isArray(arr)) return '';

  const { slide = false } = options;
  const cardClass = slide ? 'product-card swiper-slide' : 'product-card';

  return arr
    .map(
      ({ image, category: { name: categoryName }, name, description, price }) =>
        `<li class="${cardClass}">
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
        </li>`
    )
    .join('');
}

