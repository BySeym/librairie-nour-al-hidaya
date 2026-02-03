// ===========================
// AUTH GUARD - Protection des pages admin
// ===========================
(function() {
  console.log("🔒 Auth Guard activé");

  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('login.html');
  const isAdminPage = currentPath.includes('admin.html');

  
  if (isAdminPage && !isLoginPage) {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      console.warn("⚠️ Accès refusé - Pas de token");
      alert("🔒 Vous devez être connecté pour accéder à cette page");
      window.location.href = 'login.html';
      return;
    }

    
    verifyToken(token);
  }

 

  async function verifyToken(token) {
    try {
      const response = await fetch(`${window.API_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn("⚠️ Token invalide ou expiré");
        localStorage.removeItem('admin_token');
        alert("🔒 Votre session a expiré. Veuillez vous reconnecter.");
        window.location.href = 'login.html';
      } else {
        console.log("✅ Token validé");
        window.ADMIN_TOKEN = token;
      }
    } catch (err) {
      console.error("❌ Erreur vérification:", err);
   
      console.warn("⚠️ Impossible de vérifier le token - Backend indisponible");
      window.ADMIN_TOKEN = token;
    }
  }
})();