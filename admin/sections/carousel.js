// ===========================
// GESTION DU CAROUSEL
// ===========================
(function () {
  const tableBody = document.getElementById("carouselTable");

  if (!tableBody) {
    console.log("ℹ️ Table carousel non trouvée (page non-admin)");
    return;
  }

  console.log("✅ Table carousel trouvée (page admin)");

  async function loadCarousel() {
    try {
      const res = await fetch(`${window.API_URL}/api/carousel`);

      if (!res.ok) {
        console.error("❌ Erreur chargement carousel:", res.status);
        return;
      }

      const slides = await res.json();
      console.log("📊 Carousel chargé:", slides.length, "slides");

      tableBody.innerHTML = "";

      slides.forEach((slide) => {
        const tr = document.createElement("tr");

        const timestamp = Date.now();
        const imagePath = `${window.API_URL}/uploads/${slide.image}?t=${timestamp}`;

        tr.innerHTML = `
          <td>${slide.id}</td>
          <td>
            <img src="${imagePath}" alt="${slide.title}" 
                 style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;"
                 onerror="this.style.display='none'; console.error('❌ Image non trouvée:', '${slide.image}');">
          </td>
          <td>${slide.title}</td>
          <td>${slide.description}</td>
          <td>${slide.position}</td>
          <td>
            <button class="edit">✏️</button>
            <button class="delete">🗑️</button>
          </td>
        `;

        tr.querySelector(".edit").onclick = () => editSlide(slide);
        tr.querySelector(".delete").onclick = () => deleteSlide(slide.id);

        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error("❌ Erreur loadCarousel:", err);
    }
  }

  function editSlide(slide) {
    const title = prompt("Titre :", slide.title);
    if (title === null) return;

    const description = prompt("Description :", slide.description);
    if (description === null) return;

    const position = prompt("Position :", slide.position);
    if (position === null) return;

    fetch(`${window.API_URL}/api/carousel/${slide.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        image: slide.image,
        title,
        description,
        position,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Slide mise à jour:", data);
        alert("✅ Slide mise à jour avec succès !");
        loadCarousel();
      })
      .catch((err) => {
        console.error("❌ Erreur mise à jour:", err);
        alert("❌ Erreur lors de la mise à jour");
      });
  }

  function deleteSlide(id) {
    if (!confirm("Supprimer cette slide ?")) return;

    fetch(`${window.API_URL}/api/carousel/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${window.ADMIN_TOKEN}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        console.log("✅ Slide supprimée");
        alert("✅ Slide supprimée avec succès !");
        loadCarousel();
      })
      .catch((err) => {
        console.error("❌ Erreur suppression:", err);
        alert("❌ Erreur lors de la suppression");
      });
  }

  loadCarousel();

  const form = document.getElementById("addSlideForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      console.log("📤 Envoi nouvelle slide:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, value.name, `(${value.size} bytes)`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      try {
        const response = await fetch(`${window.API_URL}/api/carousel`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${window.ADMIN_TOKEN}`,
          },
          body: formData,
        });

        const data = await response.json();
        console.log("📥 Réponse serveur:", data);

        if (response.ok) {
          alert("✅ Slide ajoutée avec succès !");
          form.reset();

          const previewImage = document.getElementById("previewImage");
          if (previewImage) {
            previewImage.style.display = "none";
          }

          loadCarousel();
        } else {
          alert("❌ Erreur: " + (data.message || "Erreur inconnue"));
        }
      } catch (err) {
        console.error("❌ Erreur ajout slide:", err);
        alert("❌ Erreur lors de l'ajout");
      }
    });
  }

  const imageInput = document.getElementById("imageInput");
  const previewImage = document.getElementById("previewImage");

  if (imageInput && previewImage) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];

      if (!file) {
        previewImage.style.display = "none";
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        console.log("🖼️ Aperçu image chargé");
      };

      reader.onerror = () => {
        console.error("❌ Erreur lecture fichier");
      };

      reader.readAsDataURL(file);
    });
  }
})();
