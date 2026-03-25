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
    // 2.3 Slider služeb (Pouze posun)
    // ===============================
    const slider = document.getElementById('services-slider');
    const predchoziTlacitko = document.querySelector('.services-prev');
    const dalsiTlacitko = document.querySelector('.services-next');

    function vypocitatPosunSlideru() {
        const karta = slider?.querySelector('.service-card');
        if (!karta) return 300;

        const vypocitanyStyl = window.getComputedStyle(slider);
        const mezera = parseFloat(vypocitanyStyl.gap || '30') || 30;
        return karta.offsetWidth + mezera;
    }

    if (slider) {
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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('show')) {
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
            }

            if (mobilniMenu && mobilniMenu.classList.contains('open')) {
                zavritMenu();
            }
        }
    });
});

// Formspree odeslání bez reloadu stránky
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