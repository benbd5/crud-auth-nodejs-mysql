const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

// Pages des categories
router.get("/categories/:id", categoryController.get_category);

module.exports = router;
