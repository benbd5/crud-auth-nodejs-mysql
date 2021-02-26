const router = require("express").Router();
const userController = require("../controllers/userController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// Afficher la page profil
router.get(
  "/profil",
  verifyAuth.get_verify_auth,
  userController.get_page_profil
);

// Affiche la page de modification du profil
router.get(
  "/updateProfil/:id",
  verifyAuth.get_verify_auth,
  userController.get_update_profil
);

// Modifier le profil
router.put("/update-profil/:id", userController.update_profil);

// Ajouter/modifier une photo de profil
router.put("/addProfilPicture/:id", userController.post_picture_profil);

// Supprimer la photo de profil
router.delete("/deleteProfilPicture/:id", userController.delete_picture_profil);

// Suppimer le profil
router.delete("/deleteProfil/:id", userController.delete_profil);

module.exports = router;
