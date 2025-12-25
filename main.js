
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

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('track');
  if (!track) return;

  const slides = track.children;
  const total = slides.length;
  if (total <= 1) return;

  let index = 0;

  setInterval(() => {
    index = (index + 1) % total;
    track.style.transform = `translateX(${-index * 100}%)`;
  }, 5000); // 5 secondes
});
