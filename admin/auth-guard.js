// // ===========================
// // AUTH GUARD - Protection des pages admin
// // ===========================
// (function() {
//   console.log("🔒 Auth Guard chargé");

//   // Liste des pages qui nécessitent une authentification
//   const protectedPages = [
//     '/admin/admin.html',
//     '/admin/sections/carousel.html',
//     '/admin/sections/promo.html',
//     '/admin/sections/other.html'
//   ];

//   // Pages publiques (pas de vérification)
//   const publicPages = [
//     '/admin/login.html',
//     '/index.html',
//     '/mentions-legales.html'
//   ];

//   const currentPath = window.location.pathname;

//   // Vérifier si la page actuelle est protégée
//   const isProtectedPage = protectedPages.some(page => currentPath.includes(page));
//   const isPublicPage = publicPages.some(page => currentPath.includes(page));

//   if (isProtectedPage) {
//     const token = localStorage.getItem('adminToken');

//     if (!token) {
//       console.warn("⚠️ Accès refusé - Pas de token");
//       alert("🔒 Vous devez être connecté pour accéder à cette page");
//       window.location.href = '/admin/login.html';
//       return;
//     }

//     // Vérifier la validité du token
//     verifyToken(token);
//   }

//   // Si on est sur login et qu'on est déjà connecté
//   if (currentPath.includes('/login.html')) {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       verifyTokenAndRedirect(token);
//     }
//   }

//   async function verifyToken(token) {
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/verify', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         console.warn("⚠️ Token invalide ou expiré");
//         localStorage.removeItem('adminToken');
//         alert("🔒 Votre session a expiré. Veuillez vous reconnecter.");
//         window.location.href = '/admin/login.html';
//       } else {
//         console.log("✅ Authentification validée");
//         window.ADMIN_TOKEN = token;
//       }
//     } catch (err) {
//       console.error("❌ Erreur vérification token:", err);
//       localStorage.removeItem('adminToken');
//       window.location.href = '/admin/login.html';
//     }
//   }

//   async function verifyTokenAndRedirect(token) {
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/verify', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         console.log("✅ Déjà connecté - Redirection vers admin");
//         window.location.href = '/admin/admin.html';
//       }
//     } catch (err) {
//       console.error("❌ Erreur:", err);
//     }
//   }

//   // Rendre le token disponible globalement
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     window.ADMIN_TOKEN = token;
//   }
// })();

// ===========================
// AUTH GUARD - Protection des pages admin
// ===========================
(function() {
  console.log("🔒 Auth Guard activé");

  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('login.html');
  const isAdminPage = currentPath.includes('admin.html');

  // Protection de admin.html UNIQUEMENT
  if (isAdminPage && !isLoginPage) {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      console.warn("⚠️ Accès refusé - Pas de token");
      alert("🔒 Vous devez être connecté pour accéder à cette page");
      window.location.href = 'login.html';
      return;
    }

    // Vérifier la validité du token auprès du backend
    verifyToken(token);
  }

  // ❌ SUPPRIMER cette partie qui cause le problème
  // Ne PAS rediriger automatiquement depuis login
  // On laisse le login.js gérer la redirection après connexion réussie

  async function verifyToken(token) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
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
      // Ne pas bloquer si le backend est down
      console.warn("⚠️ Impossible de vérifier le token - Backend indisponible");
      window.ADMIN_TOKEN = token;
    }
  }
})();