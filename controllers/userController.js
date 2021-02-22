const bcrypt = require("bcrypt");

const get_page_profil = async (req, res) => {
  const id = res.locals.user;
  const userProfil = await query(
    "SELECT firstname, lastname, email, password FROM user WHERE userId = ?",
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

  /*  await query(
    "UPDATE user SET lastname = ?,  firstname = ?, email = ?, password = ? WHERE userId = ?",
    [lastname, firstname, email, password, id]
  ); */

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

module.exports = {
  get_page_profil,
  get_update_profil,
  update_profil,
};
