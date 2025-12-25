const token = localStorage.getItem("admin_token");

if (!token) {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("admin_token");
  window.location.href = "login.html";
});
