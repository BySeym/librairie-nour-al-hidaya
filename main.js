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
function initCarousel(){
  const track = document.getElementById('track');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');

  if(!track) return;
  const slides = Array.from(track.children);
  const total = slides.length;

  if(total === 0) {
    console.warn("⚠️ Aucune slide dans le carousel");
    return;
  }

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
   d.setAttribute('aria-label', 'Aller à l\'image ' + (idx+1));
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
}

// Chargement du carousel depuis l'API
async function loadCarousel() {
  const track = document.getElementById("track");
  
  if (!track) {
    console.warn("⚠️ Element #track non trouvé");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/carousel");
    
    if (!res.ok) {
      console.error("❌ Erreur API carousel:", res.status);
      return;
    }
    
    const slides = await res.json();
    
    // ✅ Vérifier que c'est un tableau
    if (!Array.isArray(slides)) {
      console.error("❌ Les données ne sont pas un tableau:", slides);
      return;
    }
    
    // ✅ Vérifier qu'il y a des slides
    if (slides.length === 0) {
      console.warn("⚠️ Aucune slide dans la base de données");
      return;
    }

    console.log(`✅ ${slides.length} slide(s) chargée(s)`);

    track.innerHTML = "";

    slides.forEach(slide => {
      const div = document.createElement("div");
      div.className = "slide";
      div.style.backgroundImage = `url('http://localhost:3000/uploads/${slide.image}')`;
      track.appendChild(div);
    });

    initCarousel();
    
  } catch (err) {
    console.error("❌ Erreur chargement carousel:", err);
  }
}

// Lancer le chargement du carousel
loadCarousel();

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

// Toast réseaux sociaux
document.addEventListener('DOMContentLoaded', function () {
  const toast = document.getElementById('socialToast');
  if (!toast) return;

  const closeBtn = toast.querySelector('.toastClose');

  setTimeout(() => {
    toast.classList.add('show');
  }, 3000);

  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
  });
});

// ===========================
// ✅ CHARGEMENT DE LA PROMO
// ===========================
async function loadPromo() {
  console.log("🔄 Chargement de la promo...");
  
  try {
    const res = await fetch("http://localhost:3000/api/promo");
    
    if (!res.ok) {
      console.error("❌ Erreur HTTP promo:", res.status);
      return;
    }
    
    const promo = await res.json();
    console.log("📊 Promo chargée:", promo);

    // Mise à jour des textes
    const badge = document.querySelector(".promoBadge");
    const title = document.querySelector(".promo h3");
    const desc = document.querySelector(".promo p");
    
    if (badge) badge.textContent = promo.badge || "";
    if (title) title.textContent = promo.title || "";
    if (desc) desc.textContent = promo.description || "";

    // Mise à jour de l'image
    const promoVisual = document.querySelector(".promoVisual");
    
    if (!promoVisual) {
      console.error("❌ Element .promoVisual introuvable dans le DOM");
      return;
    }
    
    if (!promo.image) {
      console.warn("⚠️ Aucune image définie dans la promo");
      return;
    }

    // ✅ URL avec timestamp pour éviter le cache
    const timestamp = Date.now();
    const imageUrl = `http://localhost:3000/uploads/${promo.image}?t=${timestamp}`;
    console.log("🖼️ URL image finale:", imageUrl);

    // Appliquer via variable CSS
    promoVisual.style.setProperty("--promo-image", `url("${imageUrl}")`);
    
    // ✅ Forcer aussi en style direct pour contourner le cache
    promoVisual.style.backgroundImage = `url("${imageUrl}")`;
    promoVisual.style.backgroundSize = "cover";
    promoVisual.style.backgroundPosition = "center";

    // Test de chargement de l'image
    const testImg = new Image();
    testImg.onload = () => {
      console.log("✅ Image promo chargée avec succès");
      console.log("   Dimensions:", testImg.width, "x", testImg.height);
      console.log("   URL:", imageUrl);
    };
    testImg.onerror = () => {
      console.error("❌ Impossible de charger l'image promo");
      console.error("   URL testée:", imageUrl);
      console.error("   Vérifiez:");
      console.error("   1. Le fichier existe dans backend/uploads/");
      console.error("   2. Le serveur Node.js est lancé");
      console.error("   3. Pas d'erreur 404 dans l'onglet Network (F12)");
    };
    testImg.src = imageUrl;

  } catch (err) {
    console.error("❌ Erreur loadPromo:", err);
  }
}

// ✅ LANCER LE CHARGEMENT DE LA PROMO
loadPromo();

// SECTION "UN LARGE CHOIX D’ARTICLES"
(async function loadProductsSection() {
  const container = document.getElementById("productsSection");
  if (!container) return;

  const res = await fetch("http://localhost:3000/api/products-section");
  const items = await res.json();

  container.innerHTML = "";

 items.slice(0, 15).forEach((item) => {
    const article = document.createElement("article");
    article.className = "product zoomable";
    article.dataset.img = `http://localhost:3000/uploads/${item.image}`;
    article.setAttribute("role", "button");
    article.setAttribute("tabindex", "0");

   article.innerHTML =  `
  <div class="productVisual"
       style="--product-image: url('http://localhost:3000/uploads/${item.image}')">
  </div>
      <div class="cardPad">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
        <div class="pill">Voir en grand</div>
      </div>
    `;

    container.appendChild(article);
  });

  if (window.initZoomables) window.initZoomables();
})();

// ===========================
// ZOOM IMAGE (PUBLIC)
// ===========================
document.addEventListener("click", (e) => {
  const card = e.target.closest(".zoomable");
  if (!card) return;

  const img = card.dataset.img;
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");

  modalImg.src = img;
  modal.style.display = "flex";
});

// fermer le zoom au clic
document.getElementById("imageModal")?.addEventListener("click", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");

  modal.style.display = "none";
  modalImg.src = "";
});

