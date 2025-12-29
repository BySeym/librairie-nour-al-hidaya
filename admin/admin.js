window.ADMIN_TOKEN = localStorage.getItem("admin_token");

if (!window.ADMIN_TOKEN) {
  window.location.href = "login.html";
}




/* =========================
   Sécurité : vérif login
========================= */
const token = localStorage.getItem("admin_token");

if (!token) {
  window.location.href = "login.html";
}

/* =========================
   Logout
========================= */
const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("admin_token");
  window.location.href = "login.html";
});

/* =========================
   Chargement dynamique sections
========================= */
const content = document.getElementById("adminContent");
const menuButtons = document.querySelectorAll("[data-section]");

function loadSection(section) {
  fetch(`sections/${section}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;

      // supprimer ancien script de section
      const oldScript = document.getElementById("section-script");
      if (oldScript) oldScript.remove();

      // charger le JS de la section
      const script = document.createElement("script");
      script.src = `sections/${section}.js`;
      script.id = "section-script";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(err => {
      content.innerHTML = "<p>Erreur de chargement</p>";
      console.error(err);
    });
}

/* =========================
   Menu clic
========================= */
menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.dataset.section;
    loadSection(section);
  });
});

/* =========================
   Section par défaut
========================= */
loadSection("carousel");
