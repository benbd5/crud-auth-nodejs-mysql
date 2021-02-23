const bcrypt = require("bcrypt");
const fileupload = require("express-fileupload");
const path = require("path");

const get_page_profil = async (req, res) => {
  const id = res.locals.user;
  const userProfil = await query(
    "SELECT firstname, lastname, email, password, profilPicture, userId FROM user WHERE userId = ?",
    id
  );

  // Jointure pour récupérer les articles en fonction de l'utilisateur (avec son userId)
  const articles = await query(
    "SELECT titre, image, description, categories, articleId FROM article INNER JOIN user ON article.userId = user.userId WHERE user.userId = ?",
    id
  );

  res.render("profil", {
    userProfil: userProfil[0],
    articles,
    messageUpdateSuccess: req.flash("messageUpdateSuccess"),
    noImage: req.flash("noImage"),
  });
};

const get_update_profil = async (req, res) => {
  const id = res.locals.user;

  const userProfil = await query(
    "SELECT firstname, lastname, email, password, userId FROM user WHERE userId = ?",
    id
  );
  res.render("updateProfil", {
    userProfil: userProfil[0],
  });
};

const update_profil = async (req, res) => {
  const { lastname, firstname, email, password } = req.body;
  const id = res.locals.user;

  try {
    // Hash du mdp
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await query(
      "UPDATE user SET lastname = ?,  firstname = ?, email = ?, password = ? WHERE userId = ?",
      [lastname, firstname, email, hashPassword, id],
      (err, result) => {
        if (err) {
          //   req.flash("messageError", `Il y a une erreur ${err}`);
          console.log("erreur :", err);

          res.redirect("/profil");
        }
        // Ok profil modifié --> redirection vers login
        req.flash("messageUpdateSuccess", `Votre profil a bien été modifié !`);
        res.redirect("/profil");
      }
    );
  } catch (error) {
    console.log(error);
  }

  res.redirect("/profil");
};

const post_picture_profil = async (req, res) => {
  const id = res.locals.user;

  if (!req.files) {
    req.flash("noImage", "Veuillez sélectionner une image");
    res.redirect(`back`);
  } else {
    try {
      const image = req.files.image;
      const imageName = image.name; // pour récupérer le nom de l'image dans le dossier uploads
      // TODO : vérifier si path.resolve est utile
      const fileUpload = path.resolve(
        __dirname,
        "..",
        "public/uploads/profil/",
        imageName
      );

      // Use the mv() method to place the file somewhere on your server
      image.mv(fileUpload, function (err) {
        if (err) return res.status(500).send(err);

        console.log("err1", err);
        res.redirect(`back`);
      });

      // UPDATE et non INSERT INTO car on modifie la row/ligne de la table dans mysql en ajoutant une photo
      await query("UPDATE user SET profilPicture = ? WHERE userId = ?", [
        imageName,
        id,
      ]);

      res.redirect(`back`);
    } catch (err) {
      console.log("err2", err);
    }
  }
  console.log("ok");
  res.redirect(`back`);
};

// Supprimer son compte
const delete_profil = async (req, res) => {
  const id = res.locals.user;

  // Supprime le compte
  await query("DELETE FROM user WHERE userId = ?", id);

  // Déconnecte pour éviter les erreurs et finaliser la suppression
  req.session.destroy();

  res.redirect("/");
};

module.exports = {
  get_page_profil,
  get_update_profil,
  update_profil,
  post_picture_profil,
  delete_profil,
};
