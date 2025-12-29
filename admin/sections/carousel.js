

const tableBody = document.getElementById("carouselTable");

async function loadCarousel() {
  const res = await fetch("http://localhost:3000/api/carousel");
  const slides = await res.json();

  tableBody.innerHTML = "";

  slides.forEach(slide => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${slide.id}</td>
      <td>${slide.image}</td>
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
}

loadCarousel();

function editSlide(slide) {
  const title = prompt("Titre :", slide.title);
  if (title === null) return;

  const description = prompt("Description :", slide.description);
  if (description === null) return;

  const position = prompt("Position :", slide.position);
  if (position === null) return;

  fetch(`http://localhost:3000/api/carousel/${slide.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
      Authorization: `Bearer ${window.ADMIN_TOKEN
}`,
    body: JSON.stringify({
      image: slide.image, // on garde l'image pour l'instant
      title,
      description,
      position
    })
  })
  .then(() => loadCarousel())
  .catch(console.error);
}


function deleteSlide(id) {
  if (!confirm("Supprimer cette slide ?")) return;

  fetch(`http://localhost:3000/api/carousel/${id}`, {
    method: "DELETE",
      headers: {
    Authorization: `Bearer ${window.ADMIN_TOKEN
}`
  }
  })
  .then(() => loadCarousel())
  .catch(console.error);
}

const form = document.getElementById("addSlideForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    await fetch("http://localhost:3000/api/carousel", {
      method: "POST",
   headers: {
    Authorization: `Bearer ${window.ADMIN_TOKEN}`
  },
      body: formData
    });

    form.reset();
    loadCarousel();
  } catch (err) {
    console.error("Erreur ajout slide", err);
  }
});



const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

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
  };

  reader.readAsDataURL(file);
});
