const router = require("express").Router();
const authController = require("../controllers/authController");

// Register
router.get("/register", authController.get_register_page);
router.post("/register", authController.post_register);

// Login
router.get("/login", authController.get_login_page);

module.exports = router;
