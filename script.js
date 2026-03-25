// ===============================
// 1. Navbar při scrollu
// ===============================
window.addEventListener('scroll', () => {
    const navigace = document.getElementById('navbar');
    if (!navigace) return;

    if (window.scrollY > 50) {
        navigace.classList.add('scrolled');
    } else {
        navigace.classList.remove('scrolled');
    }
});

// ===============================
// 2. Hlavní logika po načtení DOM
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const telo = document.body;

    // ===============================
    // 2.1 Mobilní menu
    // ===============================
    const tlacitkoMenu = document.getElementById('menu-toggle');
    const mobilniMenu = document.getElementById('mobile-menu');
    const odkazyMobilniMenu = document.querySelectorAll('.mobile-nav-link, .mobile-nav-phone');

    function otevritMenu() {
        if (!tlacitkoMenu || !mobilniMenu) return;
        tlacitkoMenu.classList.add('active');
        tlacitkoMenu.setAttribute('aria-expanded', 'true');
        mobilniMenu.classList.add('open');
        telo.classList.add('menu-open');
    }

    function zavritMenu() {
        if (!tlacitkoMenu || !mobilniMenu) return;
        tlacitkoMenu.classList.remove('active');
        tlacitkoMenu.setAttribute('aria-expanded', 'false');
        mobilniMenu.classList.remove('open');
        telo.classList.remove('menu-open');
    }

    if (tlacitkoMenu && mobilniMenu) {
        tlacitkoMenu.addEventListener('click', () => {
            const jeOtevrene = mobilniMenu.classList.contains('open');
            if (jeOtevrene) {
                zavritMenu();
            } else {
                otevritMenu();
            }
        });

        odkazyMobilniMenu.forEach((odkaz) => {
            odkaz.addEventListener('click', zavritMenu);
        });

        document.addEventListener('click', (udalost) => {
            if (!mobilniMenu.classList.contains('open')) return;

            const klikNaMenu =
                mobilniMenu.contains(udalost.target) ||
                tlacitkoMenu.contains(udalost.target);

            if (!klikNaMenu) {
                zavritMenu();
            }
        });
    }

    // ===============================
    // 2.2 Zjednodušené Reveal animace
    // ===============================
    const animovanePrvky = document.querySelectorAll('.reveal, .stagger-group');

    const revealObserver = new IntersectionObserver((polozky, observer) => {
        polozky.forEach((polozka) => {
            if (polozka.isIntersecting) {
                polozka.target.classList.add('active');
                observer.unobserve(polozka.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    animovanePrvky.forEach((prvek) => revealObserver.observe(prvek));

    // ===============================
    // 2.3 Slidery služeb a galerie
    // ===============================
    function inicializovatSlider({
        selectorSlider,
        selectorPredchozi,
        selectorDalsi,
        selectorPolozky,
        vychoziPosun = 300
    }) {
        const slider = document.querySelector(selectorSlider);
        const predchoziTlacitko = document.querySelector(selectorPredchozi);
        const dalsiTlacitko = document.querySelector(selectorDalsi);

        function vypocitatPosunSlideru() {
            const karta = slider?.querySelector(selectorPolozky);
            if (!karta || !slider) return vychoziPosun;

            const vypocitanyStyl = window.getComputedStyle(slider);
            const mezera = parseFloat(vypocitanyStyl.gap || '0') || 0;
            return karta.offsetWidth + mezera;
        }

        if (!slider) return;

        if (predchoziTlacitko) {
            predchoziTlacitko.addEventListener('click', () => {
                slider.scrollBy({
                    left: -vypocitatPosunSlideru(),
                    behavior: 'smooth'
                });
            });
        }

        if (dalsiTlacitko) {
            dalsiTlacitko.addEventListener('click', () => {
                slider.scrollBy({
                    left: vypocitatPosunSlideru(),
                    behavior: 'smooth'
                });
            });
        }
    }

    inicializovatSlider({
        selectorSlider: '#services-slider',
        selectorPredchozi: '.services-prev',
        selectorDalsi: '.services-next',
        selectorPolozky: '.service-card',
        vychoziPosun: 300
    });

    inicializovatSlider({
        selectorSlider: '#gallery-slider',
        selectorPredchozi: '.gallery-prev',
        selectorDalsi: '.gallery-next',
        selectorPolozky: '.gallery-item',
        vychoziPosun: 320
    });

    // ===============================
    // 2.4 Kalkulačka ceny
    // ===============================
    window.vypocet = function vypocet() {
        const typ = document.getElementById('typ');
        const plochaInput = document.getElementById('plocha');
        const vysledekDiv = document.getElementById('vysledek');

        if (!typ || !plochaInput || !vysledekDiv) return;

        const cenaZaMetr = Number(typ.value);
        const plocha = Number(plochaInput.value);

        if (plocha > 0) {
            const celkem = cenaZaMetr * plocha;
            vysledekDiv.style.display = 'block';
            vysledekDiv.innerHTML = `Předpokládaný rozpočet: ${celkem.toLocaleString('cs-CZ')} Kč`;
            vysledekDiv.style.opacity = '0';
            vysledekDiv.style.transform = 'translateY(12px)';
            vysledekDiv.style.transition = 'opacity 0.45s ease, transform 0.45s ease';

            setTimeout(() => {
                vysledekDiv.style.opacity = '1';
                vysledekDiv.style.transform = 'translateY(0)';
            }, 30);
        } else {
            alert('Zadejte prosím plochu v m².');
        }
    };

    // ===============================
    // 2.5 Automatický rok v patičce
    // ===============================
    const rokElement = document.getElementById('year');
    if (rokElement) {
        rokElement.textContent = new Date().getFullYear();
    }

    // ===============================
    // 2.6 Cookie lišta
    // ===============================
    const cookieBar = document.getElementById('cookie-bar');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBar && !localStorage.getItem('cookieConsent')) {
        cookieBar.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBar.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBar.classList.remove('show');
        });
    }

    // ===============================
    // 2.7 GDPR modal
    // ===============================
    const openBtn = document.getElementById('open-gdpr-modal');
    const closeBtn = document.getElementById('close-gdpr-modal');
    const modal = document.getElementById('gdpr-modal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    }

    // ===============================
    // 2.8 Lightbox galerie
    // ===============================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-item img');

    function otevritLightbox(srcObrazku) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = srcObrazku;
        lightbox.classList.add('show');
        document.body.classList.add('lightbox-open');
    }

    function zavritLightbox() {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.remove('show');
        document.body.classList.remove('lightbox-open');

        setTimeout(() => {
            lightboxImage.src = '';
        }, 250);
    }

    galleryImages.forEach((obrazek) => {
        obrazek.addEventListener('click', () => {
            otevritLightbox(obrazek.src);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', zavritLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                zavritLightbox();
            }
        });
    }

    // ===============================
    // 2.9 Klávesa Escape
    // ===============================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('show')) {
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }

            if (mobilniMenu && mobilniMenu.classList.contains('open')) {
                zavritMenu();
            }

            if (lightbox && lightbox.classList.contains('show')) {
                zavritLightbox();
            }
        }
    });
});

// ===============================
// 3. Formspree odeslání bez reloadu stránky
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    const formular = document.getElementById('contact-form');
    const stavFormulare = document.getElementById('form-status');

    if (!formular) return;

    formular.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!formular.checkValidity()) {
            formular.reportValidity();
            return;
        }

        const tlacitko = formular.querySelector('.submit-btn');
        const data = new FormData(formular);

        if (tlacitko) {
            tlacitko.disabled = true;
            tlacitko.textContent = 'Odesílám...';
        }

        if (stavFormulare) {
            stavFormulare.style.display = 'none';
            stavFormulare.textContent = '';
        }

        try {
            const odpoved = await fetch(formular.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (odpoved.ok) {
                formular.reset();

                if (stavFormulare) {
                    stavFormulare.style.display = 'block';
                    stavFormulare.style.color = '#2e7d32';
                    stavFormulare.textContent = 'Děkujeme, vaše poptávka byla úspěšně odeslána.';
                }
            } else {
                if (stavFormulare) {
                    stavFormulare.style.display = 'block';
                    stavFormulare.style.color = '#c62828';
                    stavFormulare.textContent = 'Odeslání se nepodařilo. Zkuste to prosím znovu.';
                }
            }
        } catch (chyba) {
            if (stavFormulare) {
                stavFormulare.style.display = 'block';
                stavFormulare.style.color = '#c62828';
                stavFormulare.textContent = 'Došlo k chybě připojení. Zkuste to prosím znovu.';
            }
        } finally {
            if (tlacitko) {
                tlacitko.disabled = false;
                tlacitko.textContent = 'Odeslat poptávku';
            }
        }
    });
});