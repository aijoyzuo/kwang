document.addEventListener('DOMContentLoaded', () => {
    /* ========= Splitting（文字切割動畫） ========= */
    if (window.Splitting) {
        Splitting();
    }

    /* ========= WOW.js（滾動進場動畫） ========= */
    if (window.WOW) {
        new WOW().init();
    }

    /* ========= 前景圖 lazy loading（img.lazy-img） ========= */
    const lazyImgs = document.querySelectorAll('img.lazy-img');

    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const img = entry.target;
                const src = img.dataset.src;

                if (src) {
                    img.src = src;
                    img.onload = () => {
                        img.classList.add('lazy-loaded'); // 觸發淡入
                    };
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        lazyImgs.forEach(img => imgObserver.observe(img));
    } else {
        lazyImgs.forEach(img => {
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.classList.add('lazy-loaded');
            }
        });
    }

    /* ========= 背景圖 lazy loading（.lazy-bg） ========= */
    const lazyBgElems = document.querySelectorAll('.lazy-bg');

    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const bgUrl = el.dataset.bg;

                if (bgUrl) {
                    const img = new Image();
                    img.src = bgUrl;
                    img.onload = () => {
                        el.style.backgroundImage = `url("${bgUrl}")`;
                        el.classList.add('bg-loaded'); // 觸發淡入
                    };
                    observer.unobserve(el);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        lazyBgElems.forEach(el => bgObserver.observe(el));
    } else {
        lazyBgElems.forEach(el => {
            const bgUrl = el.dataset.bg;
            if (bgUrl) {
                el.style.backgroundImage = `url("${bgUrl}")`;
            }
            el.classList.add('bg-loaded');
        });
    }
});


/* ========= swiper ========= */
const swiperElems = document.querySelectorAll('.sample-swiper');

function isTouchLikeDevice() {
    return window.matchMedia('(hover: none)').matches;
}

swiperElems.forEach((swiperEl) => {
    const paginationEl = swiperEl.querySelector('.swiper-pagination');

    const swiper = new Swiper(swiperEl, {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 20,

        observer: true,
        observeParents: false,
        updateOnWindowResize: true,

        loopAdditionalSlides: 2,

        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },


        lazy: { loadPrevNext: true },
        lazyPreloadPrevNext: 1,


        ...(paginationEl ? {
            pagination: { el: paginationEl, clickable: true }
        } : {}),


        on: {
            imagesReady() { swiper.update(); },
            lazyImageReady() { swiper.update(); },
        }
    });


    function stopAutoplaySafely() {
        if (swiper?.autoplay?.running) swiper.autoplay.stop();
    }
    function startAutoplaySafely() {
        if (swiper?.autoplay && !swiper.autoplay.running) swiper.autoplay.start();
    }

    let startX = 0, startY = 0, moved = false;
    const THRESHOLD = 8;

    swiperEl.addEventListener('pointerdown', (e) => {
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
    }, { passive: true });

    swiperEl.addEventListener('pointermove', (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (dx * dx + dy * dy > THRESHOLD * THRESHOLD) moved = true;
    }, { passive: true });

    swiperEl.addEventListener('pointerup', (e) => {
        if (!isTouchLikeDevice() || moved) return;

        const slide = e.target.closest('.swiper-slide[data-expandable="true"]');
        if (!slide || !swiperEl.contains(slide)) return;

        const isOpen = slide.classList.contains('is-open');
        swiperEl.querySelectorAll('.swiper-slide.is-open').forEach(el => el.classList.remove('is-open'));

        if (!isOpen) { slide.classList.add('is-open'); stopAutoplaySafely(); }
        else { startAutoplaySafely(); }
    }, { passive: true });

    swiper.on('slideChangeTransitionStart', () => {
        swiperEl.querySelectorAll('.swiper-slide.is-open').forEach(el => el.classList.remove('is-open'));
        startAutoplaySafely();
    });
});



/* ========= 開啟lightbox功能 ========= */
const modalEl = document.getElementById('projectModal');
const bsModal = new bootstrap.Modal(modalEl);

document.querySelectorAll('.swiper--modal .swiper-slide')
    .forEach(slide => {
        slide.addEventListener('click', e => {
            e.stopPropagation();

            const title = slide.dataset.title;
            const desc = slide.dataset.desc;
            const images = slide.dataset.images.split(',');


            document.getElementById('pm-title').textContent = title;
            document.getElementById('pm-desc').innerHTML = desc;

            const imgBox = document.getElementById('pm-images');
            imgBox.innerHTML = '';
            images.forEach(src => {
                imgBox.innerHTML += `<img src="${src}" alt="">`;
            });


            bsModal.show();
        });
    });

