/* Signal that JS is active — gates scroll-reveal CSS hidden states */
document.documentElement.classList.add('js-reveal-ready');

/* Mobile menu burger toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    const burger = navigation.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!navigation.classList.contains('is-open')) {
            navigation.classList.add('is-open');
        } else {
            navigation.classList.remove('is-open');
        }
    });
})();

/* Sticky nav glass/transparent toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    if (!navigation) return;

    const isHome = document.body.classList.contains('home-template');
    navigation.classList.add('home-nav');
    if (isHome) navigation.classList.add('home-nav--home');

    let threshold = Math.round(window.innerHeight * 0.10);
    function updateThreshold() {
        threshold = Math.round(window.innerHeight * 0.10);
    }
    function update() {
        const scrolled = window.scrollY > threshold;
        navigation.classList.toggle('is-scrolled', scrolled);
    }

    update();
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', function () {
        updateThreshold();
        update();
    }, {passive: true});
})();

/* Add lightbox to gallery images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();

/* Infinite scroll pagination */
(function () {
    if (!document.body.classList.contains('home-template') && !document.body.classList.contains('post-template')) {
        pagination();
    }
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');
    
    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();

/* One-page navigation smooth scroll */
(function () {
    const ids = new Set(['mission', 'werte', 'standards', 'nachhaltigkeit', 'mitglieder']);

    function closeMobileMenuIfOpen() {
        const navigation = document.querySelector('.gh-navigation');
        if (!navigation) return;
        if (!navigation.classList.contains('is-open')) return;
        navigation.classList.remove('is-open');
    }

    function scrollToHash(hash, behavior) {
        if (!hash || hash[0] !== '#') return false;
        const id = hash.slice(1);
        if (!ids.has(id)) return false;
        const el = document.getElementById(id);
        if (!el) return false;
        el.scrollIntoView({behavior: behavior || 'smooth', block: 'start'});
        return true;
    }

    document.addEventListener('click', function (e) {
        const link = e.target.closest && e.target.closest('a[href*="#"]');
        if (!link) return;

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        const isSamePage = (url.pathname === window.location.pathname);
        if (!isSamePage) return;

        if (!scrollToHash(url.hash, 'smooth')) return;
        e.preventDefault();
        closeMobileMenuIfOpen();
        history.pushState(null, '', url.hash);
    });

    window.addEventListener('hashchange', function () {
        scrollToHash(window.location.hash, 'smooth');
    });

    if (window.location.hash) {
        window.requestAnimationFrame(function () {
            scrollToHash(window.location.hash, 'smooth');
        });
    }
})();

/* Scroll reveal — Intersection Observer
   Observes .home-section and .gh-article-image (single elements) and
   .gh-feed (card grids, children stagger via CSS nth-child delays).
   Fires once per element then disconnects the observation. */
(function () {
    if (!('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll(
        '.gh-article-image, .gh-feed'
    );
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px'
    });

    targets.forEach(function (el) { observer.observe(el); });
})();

/* Hero video: hide image fallback when video is ready to play */
(function () {
    const video = document.querySelector('.home-hero-video');
    if (!video) return;

    function markReady() {
        const header = video.closest('.gh-header');
        if (!header) return;
        header.classList.add('home-hero-video-ready');
    }

    if (video.readyState >= 2) {
        markReady();
        return;
    }

    video.addEventListener('canplay', markReady, {once: true});
})();
