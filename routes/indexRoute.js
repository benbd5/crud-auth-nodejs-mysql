const router = require("express").Router();
const indexController = require("../controllers/indexController");

// GET - Index Page
router.get("/", indexController.get_index_page);

module.exports = router;
