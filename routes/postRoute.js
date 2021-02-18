const router = require("express").Router();
const postController = require("../controllers/postController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

// GET - Index Page
router.get("/", verifyAuth.get_verify_auth, postController.get_post_page);

module.exports = router;
