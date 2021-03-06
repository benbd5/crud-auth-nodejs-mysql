const router = require("express").Router();
const adminController = require("../controllers/adminController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// GET - Dashboard Page
/**
 * @swagger
 * /dashboard:
 *  get:
 *      summary: Page Dashboard/admin
 *      description: Affiche le tableau de bord/page admin
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get(
  "/dashboard",
  verifyAuth.verify_role,
  verifyAuth.get_verify_auth,
  adminController.get_admin_page
);

// DELETE utilisateur
/**
 * @swagger
 * /deleteUser/:id:
 *  delete:
 *      summary: Suppression d'un utilisateur par l'administrateur
 *      description: Supprimer un utilisateur depuis la page admin
 *      responses:
 *          200:
 *              description: Suppression réussie !
 */
router.delete(
  "/deleteUser/:id",
  verifyAuth.verify_role,
  verifyAuth.get_verify_auth,
  adminController.delete_profil
);

module.exports = router;
