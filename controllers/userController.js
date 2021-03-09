const bcrypt = require("bcrypt");
const fileupload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Affiche la page profil
const get_page_profil = async (req, res) => {
  const id = res.locals.user;
  const userProfil = await query(
    "SELECT firstname, lastname, email, password, profilPicture, userId FROM user WHERE userId = ?",
    id
  );

  res.locals.title = `Votre compte`;

  // Jointure pour récupérer les articles en fonction de l'utilisateur (avec son userId)
  const articles = await query(
    "SELECT title, image, description, dateAdd, articleId, category.categoryId, category.name FROM article INNER JOIN category ON article.categoryId = category.categoryId INNER JOIN user ON article.userId = user.userId WHERE user.userId = ? ORDER BY dateAdd DESC",
    id
  );

  res.render("profil", {
    userProfil: userProfil[0],
    articles,
    messageUpdateSuccess: req.flash("messageUpdateSuccess"),
    noImage: req.flash("noImage"),
  });
};

// Affiche la page de modification du profil
const get_update_profil = async (req, res) => {
  res.locals.title = `Modifier votre profil`;

  const id = res.locals.user;

  const userProfil = await query(
    "SELECT firstname, lastname, email, password, userId FROM user WHERE userId = ?",
    id
  );
  res.render("updateProfil", {
    userProfil: userProfil[0],
  });
};

// Modifier le profil
const update_profil = async (req, res) => {
  const { lastname, firstname, email, password } = req.body;
  const id = res.locals.user;

  // Re hasher le mdp lors de la modification
  try {
    /* // Hash du mdp
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds); */

    await query(
      "UPDATE user SET lastname = ?,  firstname = ?, email = ? WHERE userId = ?",
      [lastname, firstname, email, id],
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

// Ajouter une photo de profil
const post_picture_profil = async (req, res) => {
  const id = res.locals.user;

  if (!req.files) {
    req.flash("noImage", "Veuillez sélectionner une image");
    return res.redirect(`back`);
  }
  if (
    req.files.image.mimetype === "image/png" ||
    req.files.image.mimetype === "image/jpg" ||
    req.files.image.mimetype === "image/jpeg" ||
    req.files.image.mimetype === "image/webp"
  ) {
    const image = req.files.image;
    const imageName = image.name.split(".")[0]; // pour récupérer le nom de l'image dans le dossier uploads en ayant enlevé le mimetype d'origine

    const imageNameWebp = imageName + Date.now() + ".webp"; // regex avec replace pour remplacer les espaces du titre par un tiret

    const imagePath = path.resolve(
      __dirname,
      "..",
      "public/uploads/profil/" + imageNameWebp
    );

    // Supprimer les images du dossier pour éviter de stocker des documents inutiles
    const imageNamePath = await query(
      "SELECT profilPicture FROM user WHERE userId = ?",
      id
    );

    // Pas de photo de profil donc ajout direct
    if (!imageNamePath[0].profilPicture) {
      try {
        sharp(req.files.image.data)
          .resize(800)
          .webp({ lossless: true })
          .toFile(imagePath);

        // UPDATE et non INSERT INTO car on modifie la row/ligne de la table dans mysql en ajoutant une photo
        await query("UPDATE user SET profilPicture = ? WHERE userId = ?", [
          imageNameWebp,
          id,
        ]);

        // Assigner la nouvelle photo de profil dans la navbar
        req.session.profilPicture = imageNameWebp;

        return res.redirect(`back`);
      } catch (err) {
        console.log("err2", err);
      }
    }

    // Suppression photo precedente puis ajout de la nouvelle
    if (imageNamePath[0].profilPicture.length > 1) {
      try {
        const imageName = imageNamePath[0].profilPicture;
        const pathFile = path.resolve(
          __dirname,
          "../public/uploads/profil/",
          imageName
        );

        fs.unlink(pathFile, (err) => {
          if (err) console.log(err);
          console.log(pathFile, "pathFile was deleted");
        });
        try {
          sharp(req.files.image.data)
            .resize(800)
            .webp({ lossless: true })
            .toFile(imagePath);

          // UPDATE et non INSERT INTO car on modifie la row/ligne de la table dans mysql en ajoutant une photo
          await query("UPDATE user SET profilPicture = ? WHERE userId = ?", [
            imageNameWebp,
            id,
          ]);

          // Assigner la nouvelle photo de profil dans la navbar
          req.session.profilPicture = imageNameWebp;

          return res.redirect(`back`);
        } catch (err) {
          console.log("err2", err);
        }
      } catch (error) {
        return res.redirect(`back`);
      }
    } else {
      res.redirect(`back`);
      console.log("Erreur lors de la suppression de votre photo de profil");
    }
  } else {
    req.flash(
      "noImage",
      "Veuillez choisir un format d'image tel que : jpg, jpeg, webp ou png."
    );
    return res.redirect(`back`);
  }
};

// Suppression par l'utilisateur de sa photo de profil
const delete_picture_profil = async (req, res) => {
  const id = res.locals.user;

  // Supprimer les images du dossier pour éviter de stocker des documents inutiles
  const imageNamePath = await query(
    "SELECT profilPicture FROM user WHERE userId = ?",
    id
  );

  if (imageNamePath[0].profilPicture.length > 1) {
    try {
      const imageName = imageNamePath[0].profilPicture;
      const pathFile = path.resolve(
        __dirname,
        "../public/uploads/profil/",
        imageName
      );

      fs.unlink(pathFile, (err) => {
        if (err) console.log(err);
        console.log(pathFile, "pathFile was deleted");
      });

      // Suppression de la photo de profil = assignation de la photo par defaut
      req.session.profilPicture = "";

      res.redirect(`back`);
    } catch (error) {
      return res.redirect(`back`);
    }
  } else {
    res.redirect(`back`);
    console.log("Erreur lors de la suppression de votre photo de profil");
  }
};

// Suppression de son compte
const delete_profil = async (req, res) => {
  const id = res.locals.user;

  // Supprimer les images du dossier pour éviter de stocker des documents inutiles
  const imageNamePath = await query(
    "SELECT profilPicture FROM user WHERE userId = ?",
    id
  );

  if (imageNamePath[0].profilPicture.length > 1) {
    try {
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

      fs.unlink(pathFile, (err) => {
        if (err) console.log(err);
        console.log(pathFile, "pathFile was deleted");
      });
    } catch (error) {
      console.log(error);
    }
    // Fin de la requête de supression des images dans le dossier
  }

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
  delete_picture_profil,
};
