document.addEventListener('DOMContentLoaded', () => {
    /* ========= Splitting（文字切割動畫） ========= */
    if (window.Splitting) {
        Splitting();
    }

    /* ========= WOW.js（滾動進場動畫） ========= */
    if (window.WOW) {
        new WOW().init();
    }

    /* ========= Swiper 初始化（含 lazy） ========= */
    const swiperElems = document.querySelectorAll('.sample-swiper');

    swiperElems.forEach(swiperEl => {
        new Swiper(swiperEl, {
            loop: true,
            lazy: {
                loadPrevNext: true
            },
            pagination: {
                el: swiperEl.querySelector('.swiper-pagination'),
                clickable: true
            }
        });
    });

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
        // 老舊瀏覽器 fallback：直接載入
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
        // 老舊瀏覽器 fallback
        lazyBgElems.forEach(el => {
            const bgUrl = el.dataset.bg;
            if (bgUrl) {
                el.style.backgroundImage = `url("${bgUrl}")`;
            }
            el.classList.add('bg-loaded');
        });
    }
});
