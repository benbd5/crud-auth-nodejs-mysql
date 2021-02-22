const router = require("express").Router();
const userController = require("../controllers/userController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

router.get(
  "/profil",
  verifyAuth.get_verify_auth,
  userController.get_page_profil
);

module.exports = router;
