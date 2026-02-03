// ===========================
// GESTION SECTION PRODUITS
// ===========================
(function () {
  const tableBody = document.getElementById("productsTable");

  if (!tableBody) {
    console.log("ℹ️ Table products non trouvée");
    return;
  }

  console.log("✅ Table products trouvée (admin)");

  async function loadProducts() {
    try {
      const res = await fetch("${window.API_URL}/api/products-section");

      if (!res.ok) {
        console.error("❌ Erreur chargement produits:", res.status);
        return;
      }

      const items = await res.json();
      tableBody.innerHTML = "";

      items.forEach((item) => {
        const tr = document.createElement("tr");
        const timestamp = Date.now();
        const imagePath = `${window.API_URL}/uploads/${item.image}?t=${timestamp}`;

        tr.innerHTML = `
          <td>${item.id}</td>
          <td>
            <img src="${imagePath}" alt="${item.title}"
              style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">
          </td>
          <td>${item.title}</td>
          <td>${item.description}</td>
          <td>${item.position}</td>
          <td>
            <button class="edit">✏️</button>
            <button class="delete">🗑️</button>
          </td>
        `;

        tr.querySelector(".edit").onclick = () => editProduct(item);
        tr.querySelector(".delete").onclick = () => deleteProduct(item.id);

        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error("❌ Erreur loadProducts:", err);
    }
  }

  // ===========================
  // ÉDITION
  // ===========================
  function editProduct(item) {
    const title = prompt("Titre :", item.title);
    if (title === null) return;

    const description = prompt("Description :", item.description);
    if (description === null) return;

    const position = prompt("Position :", item.position);
    if (position === null) return;

    fetch(`${window.API_URL}/api/products-section/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        image: item.image,
        title,
        description,
        position,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(() => {
        alert("✅ Carte mise à jour");
        loadProducts();
      })
      .catch(() => alert("❌ Erreur mise à jour"));
  }

  // ===========================
  // SUPPRESSION
  // ===========================
  function deleteProduct(id) {
    if (!confirm("Supprimer cette carte ?")) return;

    fetch(`${window.API_URL}/api/products-section/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${window.ADMIN_TOKEN}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(() => {
        alert("✅ Carte supprimée");
        loadProducts();
      })
      .catch(() => alert("❌ Erreur suppression"));
  }

  // ===========================
  // AJOUT
  // ===========================
  const form = document.getElementById("addProductForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const res = await fetch(
          "${window.API_URL}/api/products-section",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${window.ADMIN_TOKEN}`,
            },
            body: formData,
          }
        );

        const data = await res.json();

        if (res.ok) {
          alert("✅ Carte ajoutée");
          form.reset();
          loadProducts();
        } else {
          alert("❌ " + (data.message || "Erreur"));
        }
      } catch (err) {
        console.error("❌ Erreur ajout:", err);
        alert("❌ Erreur ajout");
      }
    });
  }

  // ===========================
  // INIT
  // ===========================
  loadProducts();
})();
