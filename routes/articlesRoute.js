const router = require("express").Router();
const articlesController = require("../controllers/articlesController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// Page POST + poster des articles
router.get(
  "/post",
  verifyAuth.get_verify_auth,
  articlesController.get_post_page
);
router.post(
  "/send",
  verifyAuth.get_verify_auth,
  articlesController.post_article
);

// Page LISTE des articles
router.get("/liste-des-articles", articlesController.get_list_article);

// Page MODIFIER les articles + modification

// SUPPRIMER les articles

module.exports = router;
