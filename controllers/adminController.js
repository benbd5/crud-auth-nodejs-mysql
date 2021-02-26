const path = require("path");
const fs = require("fs");

// GET page admin
const get_admin_page = async (req, res) => {
  const articles = await query(
    "SELECT articleId, titre, description, image, dateAjout, userId FROM article ORDER BY dateAjout DESC"
  );

  const users = await query(
    "SELECT userId, firstname, lastname, email, profilPicture FROM user"
  );

  return res.render("admin/dashboard", { articles, users });
};

// DELETE profil
const delete_profil = async (req, res) => {
  const id = req.params.id;

  // Supprimer les images du dossier pour éviter de stocker des documents inutiles
  const imageNamePath = await query(
    "SELECT profilPicture FROM user WHERE userId = ?",
    id
  );

  if (imageNamePath.length > 1) {
    /* On récupère l'image (profilPicture) de mysql qui nous ressort un objet :
     * [ RowDataPacket { profilPicture: 'leash-bodyboard-pride-tristant-robert-grey.jpg'} ]
     * Puis on récupère l'image dans l'objet
     */
    const imageName = imageNamePath[0].profilPicture;
    const pathFile = path.resolve(
      __dirname,
      "../public/uploads/profil/",
      imageName
    );

    // Fonction qui supprime les fichiers
    fs.unlink(pathFile, (err) => {
      if (err) console.log(err);
      console.log(pathFile, "pathFile was deleted");
    });
    // Fin de la requête de supression des images dans le dossier
  }

  await query("DELETE FROM user WHERE userId = ?", [id]);
  console.log("user deleted");
  res.redirect("/admin/dashboard");
};

module.exports = {
  get_admin_page,
  delete_profil,
};
