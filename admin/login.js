const form = document.getElementById("loginForm");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      error.textContent = "Identifiants incorrects";
      return;
    }

    const data = await res.json();

    // 🔐 on stocke LE BON token
    localStorage.setItem("admin_token", data.token);

    window.location.href = "admin.html";
  } catch (err) {
    error.textContent = "Erreur serveur";
  }
});
