const router = require("express").Router();
const postController = require("../controllers/postController");

// GET - Index Page
router.get("/", postController.get_post_page);

module.exports = router;
