import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const gallery = document.querySelector('.contact-us-gallery');
const galleryList = document.querySelector('.contact-us-gallery-list');

let swiper;
let init = false;

function swiperCreate() {
  if (window.innerWidth >= 768) {
    if (!init) {
      init = true;
      addSwiperClass()
      swiper = new Swiper(gallery, {
        modules: [Navigation, Pagination],

        slidesPerView: 2,
        spaceBetween: 24,
        loop: true,
        pagination: {
          el: '.about-us-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.about-us-slide-btn.button-next',
          prevEl: '.about-us-slide-btn.button-prev',
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
    }
  } else if (init) {
    removeSwiperClass();
    swiper.destroy();
    init = false;
  }
}

function updateVisibleSlides(swiper) {
  swiper.slides.forEach(slide => {
    slide.classList.add('slide-hidden');
  });
  
  const visibleSlides = swiper.slides.slice(swiper.activeIndex, swiper.activeIndex + 2);
  visibleSlides.forEach(slide => {
    slide.classList.remove('slide-hidden');
  });
}

swiperCreate();
window.addEventListener('resize', swiperCreate);

function removeSwiperClass() {
  galleryList.classList.remove('swiper-wrapper');
}

function addSwiperClass() {
  galleryList.classList.add('swiper-wrapper');
}