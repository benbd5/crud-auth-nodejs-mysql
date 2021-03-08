const router = require("express").Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

// Bloque l'ip de l'utilisateur pendant 5mn au bout de 5 essais de connexion ratés
const passwordLoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests
  message:
    "Vous avez saisi un mauvais mot de passe 5 fois. Veuillez patienter 5 minutes avant une nouvelle tentative de connexion",
});

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
router.post("/login", passwordLoginLimiter, authController.post_login);

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
