const router = require("express").Router();
const userController = require("../controllers/userController");

// Middleware (redirection si utilisateur non connecté)
const verifyAuth = require("../middlewares/authMiddleware");

router.get(
  "/profil",
  verifyAuth.get_verify_auth,
  userController.get_page_profil
);

router.get(
  "/updateProfil/:id",
  verifyAuth.get_verify_auth,
  userController.get_update_profil
);

router.put("/update-profil/:id", userController.update_profil);

router.post("/addProfilPicture", userController.post_picture_profil);

module.exports = router;
