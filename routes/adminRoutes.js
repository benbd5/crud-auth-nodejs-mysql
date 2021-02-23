const router = require("express").Router();
const adminController = require("../controllers/adminController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// GET - Dashboard Page
router.get(
  "/dashboard",
  verifyAuth.verify_role,
  verifyAuth.get_verify_auth,
  adminController.get_admin_page
);

router.get(
  "/listeArticlesUser/:id",
  verifyAuth.get_verify_auth,
  adminController.get_articles_users
);

router.delete(
  "/deleteUser/:id",
  verifyAuth.verify_role,
  verifyAuth.get_verify_auth,
  adminController.delete_profil
);

module.exports = router;
