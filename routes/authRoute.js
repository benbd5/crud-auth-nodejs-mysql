const router = require("express").Router();
const authController = require("../controllers/authController");

// Page register
router.get("/register", authController.get_register_page);

// S'inscrire
router.post("/register", authController.post_register);

// Page login
router.get("/login", authController.get_login_page);

// Se connecter
router.post("/login", authController.post_login);

// Logout
router.get("/logout", authController.get_logout);

module.exports = router;
