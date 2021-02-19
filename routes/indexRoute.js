const router = require("express").Router();
const indexController = require("../controllers/indexController");

// GET - Index Page
router.get("/liste-des-articles", indexController.get_index_page);

module.exports = router;
