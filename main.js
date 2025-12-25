
  // Année auto
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menu mobile
  (function(){
    const burger = document.getElementById('burger');
    const drawer = document.getElementById('drawer');
    if(!burger || !drawer) return;
    burger.addEventListener('click', () => drawer.classList.toggle('open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  })();

  // Lightbox (Produits + Univers)
  (function(){
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lbImg');
    const closeBtn = document.getElementById('lbClose');
    const cards = document.querySelectorAll('.zoomable[data-img]');

    function open(src){
      img.src = src;
      box.classList.add('active');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      box.classList.remove('active');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      img.src = '';
    }

    cards.forEach(card => {
      card.addEventListener('click', () => open(card.getAttribute('data-img')));
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card.getAttribute('data-img'));
        }
      });
    });

    closeBtn.addEventListener('click', close);
    box.addEventListener('click', (e) => { if(e.target === box) close(); });
    window.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
  })();

  // Carousel
  (function(){
    const track = document.getElementById('track');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const dotsWrap = document.getElementById('dots');

    if(!track) return;
    const slides = Array.from(track.children);
    const total = slides.length;

    let i = 0;
    let timer = null;
    let startX = 0;
    let dx = 0;
    let paused = false;

    function renderDots(){
      dotsWrap.innerHTML = '';
      slides.forEach((_, idx) => {
        const d = document.createElement('button');
        d.className = 'dot' + (idx === i ? ' active' : '');
        d.type = 'button';
        d.setAttribute('aria-label', 'Aller à l’image ' + (idx+1));
        d.addEventListener('click', () => go(idx));
        dotsWrap.appendChild(d);
      });
    }

    function go(index){
      i = (index + total) % total;
      track.style.transform = `translateX(${-i * 100}%)`;
      renderDots();
    }

    function nextSlide(){ go(i + 1); }
    function prevSlide(){ go(i - 1); }

    prev?.addEventListener('click', prevSlide);
    next?.addEventListener('click', nextSlide);

    function start(){
      stop();
      timer = setInterval(() => {
        if(!paused) nextSlide();
      }, 5000);
    }
    function stop(){
      if(timer) clearInterval(timer);
      timer = null;
    }

    // Pause au survol
    const root = track.closest('.carousel');
    root?.addEventListener('mouseenter', () => paused = true);
    root?.addEventListener('mouseleave', () => paused = false);

    // Swipe mobile
    root?.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      dx = 0;
    }, {passive:true});

    root?.addEventListener('touchmove', (e) => {
      dx = e.touches[0].clientX - startX;
    }, {passive:true});

    root?.addEventListener('touchend', () => {
      if(Math.abs(dx) > 45){
        dx < 0 ? nextSlide() : prevSlide();
      }
    });

    go(0);
    start();
  })();

  

  // Animation promo au scroll — rejouable
  (function(){
    const promo = document.querySelector('.promoBox');
    if(!promo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting){
          promo.classList.add('is-visible');
        } else {
          promo.classList.remove('is-visible');
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(promo);
  })();

  // Animation Univers – cartes en cascade
  (function(){
    const cards = document.querySelectorAll('.universGrid .uCard');
    if(!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const card = entry.target;

          if(entry.isIntersecting){
            const index = [...cards].indexOf(card);
            card.style.transitionDelay = `${index * 90}ms`;
            card.classList.add('is-visible');
          } else {
            card.classList.remove('is-visible');
            card.style.transitionDelay = '0ms';
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach(card => observer.observe(card));
  })();

  document.addEventListener('DOMContentLoaded', function () {
    const toast = document.getElementById('socialToast');
    if (!toast) return;

    const closeBtn = toast.querySelector('.toastClose');

    // Affichage après 3 secondes
    setTimeout(() => {
      toast.classList.add('show');
    }, 3000);

    // Fermeture
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  });


  fetch('/content/home.json')
  .then(response => response.json())
  .then(data => {
    const track = document.getElementById('track');
    if (!track || !Array.isArray(data.carousel)) return;

    // Reset du carousel
    track.innerHTML = '';

    // Génération des slides depuis le CMS
    data.carousel.forEach(({ image }) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.style.backgroundImage = `url('${image}')`;
      track.appendChild(slide);
    });
  })
  .catch(error => {
    console.error('Erreur chargement carousel :', error);
  });

