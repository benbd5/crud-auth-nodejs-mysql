const router = require("express").Router();
const adminController = require("../controllers/adminController");

// GET - Dashboard Page
router.get("/dashboard", adminController.get_admin_page);

module.exports = router;
