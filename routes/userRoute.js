const router = require("express").Router();
const userController = require("../controllers/userController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// Afficher la page profil
/**
 * @swagger
 * /profil:
 *  get:
 *      summary: Page profil utilisateur
 *      description: Affiche le profil d'un utilisateur
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get(
  "/profil",
  verifyAuth.get_verify_auth,
  userController.get_page_profil
);

// Affiche la page de modification du profil
/**
 * @swagger
 * /updateProfil/:id:
 *  get:
 *      summary: Page de modification du profil utilisateur
 *      description: Affiche la page de modification du profil d'un utilisateur
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get(
  "/updateProfil/:id",
  verifyAuth.get_verify_auth,
  userController.get_update_profil
);

// Modifier le profil
/**
 * @swagger
 * /update-profil/:id:
 *  put:
 *      summary: Modification de profil
 *      description: Modification de profil
 *      responses:
 *          200:
 *              description: Modification réussie !
 */
router.put("/update-profil/:id", userController.update_profil);

// Ajouter/modifier une photo de profil
/**
 * @swagger
 * /addProfilPicture/:id:
 *  put:
 *      summary: Ajout photo de profil
 *      description: Ajout photo de profil
 *      responses:
 *          200:
 *              description: Ajout réussi !
 */
router.put("/addProfilPicture/:id", userController.post_picture_profil);

// Supprimer la photo de profil
/**
 * @swagger
 * /deleteProfilPicture/:id:
 *  delete:
 *      summary: Suppression photo de profil
 *      description: Suppression photo de profil
 *      responses:
 *          200:
 *              description: Suppression réussie !
 */
router.delete("/deleteProfilPicture/:id", userController.delete_picture_profil);

// Suppimer le profil
/**
 * @swagger
 * /deleteProfil/:id:
 *  delete:
 *      summary: Suppression du compte
 *      description: Suppression du compte de l'utilisateur
 *      responses:
 *          200:
 *              description: Suppression réussie !
 */
router.delete("/deleteProfil/:id", userController.delete_profil);

module.exports = router;
