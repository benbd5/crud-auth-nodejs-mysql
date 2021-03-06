const router = require("express").Router();
const articlesController = require("../controllers/articlesController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// Page d'accueil qui affiche les articles les plus récents
/**
 * @swagger
 * /:
 *  get:
 *      summary: Page d'accueil
 *      description: Affiche la page d'accueil avec les articles les plus récents
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get("/", articlesController.get_list_article);

// Page LISTE des articles
router.get("/liste-des-articles", articlesController.get_list_article);

// Page d'un seul article
/**
 * @swagger
 * /liste-des-articles/:id:
 *  get:
 *      summary: Page d'un article détaillé
 *      description: Affiche la page d'un seul article avec tout son contenu
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get("/liste-des-articles/:id", articlesController.get_details_article);

// Page POST des articles
/**
 * @swagger
 * /post:
 *  get:
 *      summary: Page pour poster un article
 *      description: Affiche la page pour poster un article
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get(
  "/post",
  verifyAuth.get_verify_auth,
  articlesController.get_post_page
);

// Poster des articles
/**
 * @swagger
 * /send:
 *  post:
 *      summary: Post d'un article
 *      description: Réalise le post d'un article
 *      responses:
 *          200:
 *              description: Post réussi !
 */
router.post(
  "/send",
  verifyAuth.get_verify_auth,
  articlesController.post_article
);

// Page MODIFIER les articles
/**
 * @swagger
 * /updateArticle/:id:
 *  get:
 *      summary: Page pour modifier un article
 *      description: Affiche la page pour modifier un article
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get(
  "/updateArticle/:id",
  verifyAuth.get_verify_auth,
  articlesController.get_update_article
);

// Modifier un article
/**
 * @swagger
 * /update-article/:id:
 *  put:
 *      summary: Modification d'un article
 *      description: Modifier un article
 *      responses:
 *          200:
 *              description: Modification réussie !
 */
router.put(
  "/update-article/:id",
  verifyAuth.get_verify_auth,
  articlesController.update_article
);

// Affiche tous les articles de l'utilisateur sélectionné
/**
 * @swagger
 * /listeArticlesUser/:id:
 *  get:
 *      summary: Affiche les articles liés à un utilisateur
 *      description: Affiche les articles liés à un utilisateur
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get("/listeArticlesUser/:id", articlesController.get_articles_users);

// SUPPRIMER les articles
/**
 * @swagger
 * /delete/:id:
 *  delete:
 *      summary: Suppression d'un article
 *      description: Supprimer un article par un utilisateur
 *      responses:
 *          200:
 *              description: Suppression réussi !
 */
router.delete(
  "/delete/:id",
  verifyAuth.get_verify_auth,
  articlesController.delete_articles
);

module.exports = router;
