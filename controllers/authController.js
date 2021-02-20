const bcrypt = require("bcrypt");

// ------------------- Register -------------------
const get_register_page = (req, res) => {
  res.render("register", {
    messageEmailUsed: req.flash("messageEmailUsed"),
    messageError: req.flash("messageError"),
    messageFields: req.flash("messageFields"),
    messageDoubleChekMdp: req.flash("messageDoubleChekMdp"),
  });
};

const post_register = async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  const form = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };

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

    // TODO : voir pour redirect au lieu de render pour éviter de répéter les messages flash
    res.render("register", {
      form,
      messageEmailUsed: req.flash("messageEmailUsed"),
      messageError: req.flash("messageError"),
      messageFields: req.flash("messageFields"),
      messageDoubleChekMdp: req.flash("messageDoubleChekMdp"),
    });
  }

  // Mots de passes non hashés lors de la comparaison
  if (password != confirmPassword) {
    req.flash(
      "messageDoubleChekMdp",
      "Les mots de passe ne sont pas identiques."
    );

    // TODO : voir pour redirect au lieu de render pour éviter de répéter les messages flash
    res.render("register", {
      form,
      messageEmailUsed: req.flash("messageEmailUsed"),
      messageError: req.flash("messageError"),
      messageFields: req.flash("messageFields"),
      messageDoubleChekMdp: req.flash("messageDoubleChekMdp"),
    });
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
            // Flash pour récupérer les données saisies par l'utilisateur
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
  res.render("login", {
    messageRegisterSuccess: req.flash("messageRegisterSuccess"),
    messageEmailIncorrect: req.flash("messageEmailIncorrect"),
    messageNotConnected: req.flash("messageNotConnected"),
    messageMdpIncorrect: req.flash("messageMdpIncorrect"),
  });
};

const post_login = async (req, res) => {
  const { email, password } = req.body;

  // Vérification de l'email
  const checkEmail = await query("SELECT * FROM user WHERE email=?", email);

  if (checkEmail[0].email != email) {
    // console.log("email:", email, "check:", checkEmail[0].email);
    req.flash(
      "messageEmailIncorrect",
      `L'email est incorrect. Veuillez la saisir à nouveau ou vous inscrire en cliquant ` // (ici) --> suite sur login.ejs
    );
    return res.redirect("/auth/login");
  } else {
    // L'email existe : vérification du mot de passe
    const user = await query(
      "SELECT userID, firstname, lastname, email, password FROM user WHERE email = ?",
      email
    );

    // Comparaison des mots de passe
    const match = await bcrypt.compare(password, user[0].password);

    if (match) {
      //login
      req.session.userId = user[0].userID;
      req.session.firstname = user[0].firstname;

      // récupérer les infos de l'utilisateur et les stocker dans la session
      req.session.user = {
        id: user[0].userID,
        firstname: user[0].firstname,
        lastname: user[0].lastname,
        email: user[0].email,
      };
      console.log("session :", req.session.user);
      res.redirect("/");
    } else {
      req.flash(
        "messageMdpIncorrect",
        `Le mot de passe est incorrect. Veuillez le saisir à nouveau.`
      );
      res.redirect("login");
    }
  }
};

//  --------------- Logout ---------------
const get_logout = async (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/auth/login");
  });
};

module.exports = {
  get_register_page,
  post_register,
  get_login_page,
  post_login,
  get_logout,
};
