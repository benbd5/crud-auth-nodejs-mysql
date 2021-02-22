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

module.exports = router;
