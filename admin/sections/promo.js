(function () {
  const form = document.getElementById("promoForm");
  if (!form) return;

  // charger promo existante
  fetch("http://localhost:3000/api/promo")
    .then(res => res.json())
    .then(promo => {
      form.badge.value = promo.badge;
      form.title.value = promo.title;
      form.description.value = promo.description;
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    await fetch("http://localhost:3000/api/promo", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${window.ADMIN_TOKEN}`
      },
      body: formData
    });

    alert("Promo mise à jour");
  });
})();


async function loadPromo() {
  const res = await fetch("http://localhost:3000/api/promo");
  const promo = await res.json();

  document.querySelector(".promoBadge").textContent = promo.badge;
  document.querySelector(".promo h3").textContent = promo.title;
  document.querySelector(".promo p").textContent = promo.description;

  const promoVisual = document.querySelector(".promoVisual");

  // ✅ ON PASSE PAR LA VARIABLE CSS
  promoVisual.style.setProperty(
    "--promo-image",
    `url("http://localhost:3000/uploads/${promo.image}")`
  );
}

loadPromo();


