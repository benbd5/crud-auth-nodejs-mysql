const router = require("express").Router();
const authController = require("../controllers/authController");

// Page register
/**
 * @swagger
 * /register:
 *  get:
 *      summary: Page inscription
 *      description: Affiche la page inscription
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get("/register", authController.get_register_page);

// S'inscrire
/**
 * @swagger
 * /register:
 *  post:
 *      summary: Inscription
 *      description: Inscription
 *      responses:
 *          200:
 *              description: Inscription réussie !
 */
router.post("/register", authController.post_register);

// Page login
/**
 * @swagger
 * /login:
 *  get:
 *      summary: Page connexion
 *      description: Affiche la page connexion
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get("/login", authController.get_login_page);

// Se connecter
/**
 * @swagger
 * /login:
 *  post:
 *      summary: Connexion
 *      description: Connexion d'un utilisateur
 *      responses:
 *          200:
 *              description: Connexion réussie !
 */
router.post("/login", authController.post_login);

// Logout
/**
 * @swagger
 * /logout:
 *  get:
 *      summary: Déconnexion
 *      description: Déconnexion
 *      responses:
 *          200:
 *              description: Déconnexion réussie !
 */
router.get("/logout", authController.get_logout);

module.exports = router;
