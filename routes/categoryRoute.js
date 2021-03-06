const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

// Pages des categories
/**
 * @swagger
 * /categories/:id:
 *  get:
 *      summary: Page d'un département sélectionné
 *      description: Affiche un département et les articles qui lui sont associés
 *      responses:
 *          200:
 *              description: Affichage réussi !
 */
router.get("/categories/:id", categoryController.get_category);

module.exports = router;
