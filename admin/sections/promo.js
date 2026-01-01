// ===========================
// GESTION ADMIN - Upload promo
// ===========================
(function () {
  const form = document.getElementById("promoForm");
  if (!form) {
    console.log("ℹ️ Formulaire promo non trouvé (page publique)");
    return;
  }

  console.log("✅ Formulaire promo trouvé (page admin)");

  // Charger la promo existante
  async function loadCurrentPromo() {
    try {
      const res = await fetch("http://localhost:3000/api/promo");
      
      if (!res.ok) {
        console.error("❌ Erreur chargement promo:", res.status);
        return;
      }
      
      const promo = await res.json();
      console.log("📊 Promo actuelle:", promo);

      // Remplir les champs
      form.badge.value = promo.badge || "";
      form.title.value = promo.title || "";
      form.description.value = promo.description || "";
      
      // Afficher l'image actuelle
      const preview = document.getElementById("currentImage");
      if (preview && promo.image) {
        const imageUrl = `http://localhost:3000/uploads/${promo.image}?t=${Date.now()}`;
        preview.src = imageUrl;
        preview.style.display = "block";
        console.log("🖼️ Image actuelle affichée:", imageUrl);
      }
    } catch (err) {
      console.error("❌ Erreur chargement promo:", err);
    }
  }

  // Charger au démarrage
  loadCurrentPromo();

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    
    // Log des données envoyées
    console.log("📤 Envoi des données:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, value.name, `(${value.size} bytes)`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    try {
      const response = await fetch("http://localhost:3000/api/promo", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${window.ADMIN_TOKEN}`
        },
        body: formData
      });

      const data = await response.json();
      console.log("📥 Réponse serveur:", data);

      if (response.ok) {
        alert("✅ Promo mise à jour avec succès !");
        
        // Recharger l'aperçu avec la nouvelle image
        if (data.image) {
          const preview = document.getElementById("currentImage");
          if (preview) {
            const imageUrl = `http://localhost:3000/uploads/${data.image}?t=${data.timestamp || Date.now()}`;
            preview.src = imageUrl;
            preview.style.display = "block";
            console.log("🔄 Image mise à jour:", imageUrl);
          }
        }
        
        // Réinitialiser le champ file
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        alert("❌ Erreur: " + data.message);
        console.error("❌ Erreur serveur:", data);
      }
    } catch (err) {
      console.error("❌ Erreur réseau:", err);
      alert("❌ Erreur lors de la mise à jour");
    }
  });
})();

// ===========================
// AFFICHAGE PUBLIC - Page d'accueil
// ===========================
async function loadPromo() {
  console.log("🔄 Chargement de la promo...");
  
  try {
    const res = await fetch("http://localhost:3000/api/promo");
    
    if (!res.ok) {
      console.error("❌ Erreur HTTP:", res.status);
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
    
    // ✅ Forcer le rechargement en modifiant aussi le background directement
    promoVisual.style.backgroundImage = `url("${imageUrl}")`;

    // Test de chargement de l'image
    const testImg = new Image();
    testImg.onload = () => {
      console.log("✅ Image chargée avec succès");
      console.log("   Dimensions:", testImg.width, "x", testImg.height);
      console.log("   URL:", imageUrl);
    };
    testImg.onerror = () => {
      console.error("❌ Impossible de charger l'image");
      console.error("   URL testée:", imageUrl);
      console.error("   Vérifiez:");
      console.error("   1. Le fichier existe dans backend/uploads/");
      console.error("   2. Le serveur Node.js est lancé");
      console.error("   3. Pas d'erreur 404 dans l'onglet Network");
    };
    testImg.src = imageUrl;

  } catch (err) {
    console.error("❌ Erreur loadPromo:", err);
  }
}

// Charger la promo si on est sur la page publique
if (document.querySelector(".promoVisual")) {
  console.log("📄 Page publique détectée, chargement de la promo...");
  loadPromo();
} else {
  console.log("📄 Page admin détectée");
}