const router = require("express").Router();
const articlesController = require("../controllers/articlesController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

router.get("/", articlesController.get_list_article);

// Page LISTE des articles
router.get("/liste-des-articles", articlesController.get_list_article);
router.get("/liste-des-articles/:id", articlesController.get_details_article);

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

// Page MODIFIER les articles + modification
router.get(
  "/updateArticle/:id",
  verifyAuth.get_verify_auth,
  articlesController.get_update_article
);
router.put(
  "/update-article/:id",
  verifyAuth.get_verify_auth,
  articlesController.update_article
);

// SUPPRIMER les articles
router.delete(
  "/delete/:id",
  verifyAuth.get_verify_auth,
  articlesController.delete_articles
);

module.exports = router;
