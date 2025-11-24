// 初始化所有 Swiper
document.querySelectorAll('.long-swiper').forEach(el => {
  new Swiper(el, {
    direction: 'horizontal',
    slidesPerView: 1,
    lazy: {
      loadPrevNext: true,
    },
    allowTouchMove: true,
    spaceBetween: 10,
  });
});
