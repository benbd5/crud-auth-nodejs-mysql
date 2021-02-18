const bcrypt = require("bcrypt");

// ------------------- Register -------------------
const get_register_page = (req, res) => {
  res.render("register", {
    messageEmailUsed: req.flash("messageEmailUsed"),
    messageError: req.flash("messageError"),
    messageFields: req.flash("messageFields"),
  });
};

const post_register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Vérifie si l'email existe
  const findEmail = await query(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );

  if (findEmail[0].cnt > 0) {
    req.flash("messageEmailUsed", "Email déjà utilisé");
  }

  // Condition pour vérifier que les champs ne sont pas vides
  if (!firstname || !lastname || !email || !password) {
    req.flash("messageFields", "Veuillez remplir tous les champs.");
    res.redirect("/auth/register");
  } else {
    // Ajout d'un utilisateur
    try {
      // Hash du mdp
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      await query(
        "INSERT INTO user (firstname, lastname, email, password) VALUES (?,?,?,?)",
        [firstname, lastname, email, hashPassword],
        (err, result) => {
          if (err) {
            req.flash("messageError", `Il y a une erreur ${err}`);
            return res.redirect("/auth/register");
          }
          // Ok inscription effectuée --> redirection vers login
          req.flash(
            "messageRegisterSuccess",
            `Votre compte a bien été créé ! Vous pouvez vous connecter.`
          );
          return res.redirect("/auth/login");
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
};

// ------------------- Login -------------------
const get_login_page = (req, res) => {
  res.render("login");
};

module.exports = {
  get_register_page,
  get_login_page,
  post_register,
};
