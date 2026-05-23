import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const backendData = {
  "feedbacks": [
    { "_id": "6854873d82d4e3521f90a269", "rate": 4.5, "description": "Дуже задоволена замовленням, тістечка просто тануть у роті.", "author": "Олена Мельник" },
    { "_id": "6854873d82d4e3521f90a26a", "rate": 5, "description": "Ціна-якість на висоті, обов'язково замовлятиму ще!", "author": "Дмитро Савченко" },
    { "_id": "6854873d82d4e3521f90a26b", "rate": 4, "description": "Смачно, але хотілося б більший вибір безглютенових десертів.", "author": "Марія Бондар" },
    { "_id": "6854873d82d4e3521f90a26c", "rate": 5, "description": "Завжди свіжа випічка, мої улюблені еклери!", "author": "Ігор Петренко" },
    { "_id": "6854873d82d4e3521f90a26d", "rate": 3.5, "description": "Десерти нормальні, але доставка була трохи довшою, ніж очікував.", "author": "Наталя Мороз" },
    { "_id": "6854873d82d4e3521f90a270", "rate": 4, "description": "Сподобалось все, крім одного тістечка, яке було трохи прим'яте.", "author": "Олександр Шевченко" },
    { "_id": "6854873d82d4e3521f90a271", "rate": 5, "description": "Завжди тут замовляю, ніколи не розчаровують!", "author": "Юлія Клименко" },
    { "_id": "6854873d82d4e3521f90a272", "rate": 3.5, "description": "Десерти смачні, але ціни трохи завищені, як на мене.", "author": "Сергій Коваленко" },
    { "_id": "6854873d82d4e3521f90a26e", "rate": 4.5, "description": "Замовляли торт на свято, всі гості були в захваті.", "author": "Володимир Ткаченко" },
    { "_id": "6854873d82d4e3521f90a26f", "rate": 5, "description": "Чудовий сервіс, десерти приїхали ідеально запаковані.", "author": "Тетяна Лисенко" }
  ]
};

const feedbackSlider = document.querySelector('.mySwiper');
const container = document.getElementById('feedbacks-container');


function generateStarsTemplate(rating) {
  let starsHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      
      starsHTML += `
        <svg class="star full" width="20" height="20" viewBox="0 0 24 24" fill="#080C0C" stroke="#080C0C" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
        </svg>`;
    } else if (rating > i - 1 && rating < i) {
      starsHTML += `
        <svg class="star half" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="halfGrad-${i}">
              <stop offset="50%" stop-color="#080C0C"/>
              <stop offset="50%" stop-color="transparent"/>
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                fill="url(#halfGrad-${i})" stroke="#080C0C" stroke-width="2" stroke-linejoin="round"/>
        </svg>`;
    } else {
      starsHTML += `
        <svg class="star empty" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#080C0C" stroke-width="2" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
        </svg>`;
    }
  }
  
  return `<div class="star-rating theme-default-star">${starsHTML}</div>`;
}

function renderFeedbacks(data) {
  if (!container) return;
  container.innerHTML = ''; 
  
  let slidesHTML = '';
  data.feedbacks.forEach(item => {
    const starsContainer = generateStarsTemplate(item.rate);

    slidesHTML += `
      <li class="swiper-slide">
        <div class="feedback-card">
          <div class="rating-wrapper">
            ${starsContainer}
          </div>
          <p class="feedback-text">"${item.description}"</p>
          <div class="feedback-author">${item.author}</div>
        </div>
      </li>
    `;
  });
  container.innerHTML = slidesHTML;
}


renderFeedbacks(backendData);
if (container) container.classList.add('swiper-wrapper');


const swiperInstance = new Swiper(feedbackSlider, {
  modules: [Navigation, Pagination],
  slidesPerView: 1,       
  spaceBetween: 20,
  grabCursor: true,
  loop: true,
  
  pagination: {
    el: '.feedback-pagination',
      clickable: true,
    dynamicBullets: true,
    renderBullet: function (index, className) {
      return `<span class="${className}"></span>`;
    }
  },
  
  navigation: {
    nextEl: '.feedback-slide-btn.button-next',
    prevEl: '.feedback-slide-btn.button-prev',
  },
  
  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 24,
      },
      1440: {
      slidesPerView: 3,
      spaceBetween: 24,
    }
  },
  
  on: {
    init: function() {
      updateVisibleSlides(this);
    },
    slideChange: function() {
      updateVisibleSlides(this);
    },
  },
});

function updateVisibleSlides(swiper) {
  if (window.innerWidth < 768) {
    swiper.slides.forEach(slide => slide.classList.remove('slide-hidden'));
    return;
  }

  swiper.slides.forEach(slide => {
    slide.classList.add('slide-hidden');
  });

  const visibleSlides = swiper.slides.slice(swiper.activeIndex, swiper.activeIndex + 3);
  visibleSlides.forEach(slide => {
    slide.classList.remove('slide-hidden');
  });
}


window.addEventListener('resize', () => {
  if (swiperInstance) updateVisibleSlides(swiperInstance);
});









// const backendData = {
//   "feedbacks": [
//     { "_id": "6854873d82d4e3521f90a269", "rate": 4.5, "description": "Дуже задоволена замовленням, тістечка просто тануть у роті.", "author": "Олена Мельник" },
//     { "_id": "6854873d82d4e3521f90a26a", "rate": 5, "description": "Ціна-якість на висоті, обов'язково замовлятиму ще!", "author": "Дмитро Савченко" },
//     { "_id": "6854873d82d4e3521f90a26b", "rate": 4, "description": "Смачно, але хотілося б більший вибір безглютенових десертів.", "author": "Марія Бондар" },
//     { "_id": "6854873d82d4e3521f90a26c", "rate": 5, "description": "Завжди свіжа випічка, мої улюблені еклери!", "author": "Ігор Петренко" },
//     { "_id": "6854873d82d4e3521f90a26d", "rate": 3.5, "description": "Десерти нормальні, але доставка была трохи довшою, ніж очікував.", "author": "Наталя Мороз" },
//     { "_id": "6854873d82d4e3521f90a270", "rate": 4, "description": "Сподобалось все, крім одного тістечка, яке було трохи прим'яте.", "author": "Олександр Шевченко" },
//     { "_id": "6854873d82d4e3521f90a271", "rate": 5, "description": "Завжди тут замовляю, ніколи не розчаровують!", "author": "Юлія Клименко" },
//     { "_id": "6854873d82d4e3521f90a272", "rate": 3.5, "description": "Десерти смачні, але ціни трохи завищені, як на мене.", "author": "Сергій Коваленко" },
//     { "_id": "6854873d82d4e3521f90a26e", "rate": 4.5, "description": "Замовляли торт на свято, всі гості були в захваті.", "author": "Володимир Ткаченко" },
//     { "_id": "6854873d82d4e3521f90a26f", "rate": 5, "description": "Чудовий сервіс, десерти приїхали ідеально запаковані.", "author": "Тетяна Лисенко" }
//   ]
// };