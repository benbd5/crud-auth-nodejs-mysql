const bcrypt = require("bcrypt");

// ------------------- Register -------------------
// Affiche la page inscription
const get_register_page = (req, res) => {
  res.locals.title = `S'inscrire`;

  // Faire passer le req.flash dans le req.locals pour récupérer les données
  res.locals.flashes = req.flash("form")[0];

  if (!res.locals.user) {
    res.render("register", {
      messageEmailUsed: req.flash("messageEmailUsed"),
      messageError: req.flash("messageError"),
      messageFields: req.flash("messageFields"),
      messageDoubleChekMdp: req.flash("messageDoubleChekMdp"),

      // Données récupérées et injectées dans la vue
      form: res.locals.flashes,
    });
  } else {
    req.flash("alreadyConnected", "Vous êtes déjà connecté !");
    res.redirect(`back`);
  }
};

// S'inscrire
const post_register = async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  // Rôle définit pour les utilisateurs
  const roles = "user";
  const dateRegister = new Date().toISOString().split("T")[0];

  const form = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };

  // Vérifie si l'email existe
  const findEmail = await query(
    "SELECT COUNT(email) AS cnt FROM user WHERE ?? = ?",
    [`email`, email]
  );

  if (findEmail[0].cnt > 0) {
    req.flash("messageEmailUsed", "Email déjà utilisée");
    req.flash("form", form);

    // return permet de stopper le code en cours et d'effectuer directement l'action demandée apres le return
    return res.redirect(`back`);
  }

  // Condition pour vérifier que les champs ne sont pas vides
  else if (!firstname || !lastname || !email || !password) {
    req.flash("messageFields", "Veuillez remplir tous les champs.");
    req.flash("form", form);
    return res.redirect(`back`);
  }

  // Mots de passes non hashés lors de la comparaison --> à modifier
  else if (password != confirmPassword) {
    req.flash(
      "messageDoubleChekMdp",
      "Les mots de passe ne sont pas identiques."
    );

    req.flash("form", form);

    return res.redirect(`back`);
  } else if (password == confirmPassword) {
    // Ajout d'un utilisateur et hash du mdp
    try {
      // Hash du mdp
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      await query(
        "INSERT INTO user (firstname, lastname, email, password, dateRegister, roles) VALUES (?,?,?,?,?,?)",
        [firstname, lastname, email, hashPassword, dateRegister, roles],
        (err, result) => {
          if (err) {
            console.log("erreur :", err);

            res.redirect(`back`);
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
// Affiche la page connexion
const get_login_page = (req, res) => {
  res.locals.title = `Se connecter`;

  if (!res.locals.user) {
    res.render("login", {
      messageRegisterSuccess: req.flash("messageRegisterSuccess"),
      messageEmailIncorrect: req.flash("messageEmailIncorrect"),
      messageNotConnected: req.flash("messageNotConnected"),
      messageMdpIncorrect: req.flash("messageMdpIncorrect"),
      messageFields: req.flash("messageFields"),
    });
  } else {
    req.flash("alreadyConnected", "Vous êtes déjà connecté !");
    res.redirect(`back`);
  }
};

// Se connecter
const post_login = async (req, res) => {
  const { email, password } = req.body;

  // Vérification de l'email
  // const checkEmail = await query("SELECT email FROM user WHERE email=?", email);
  const checkEmail = await query(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );

  if (!email || !password) {
    req.flash("messageFields", "Veuillez remplir tous les champs.");
    return res.redirect(`back`);
  }

  // if (checkEmail[0].email != email) {
  if (!checkEmail[0].cnt > 0) {
    req.flash(
      "messageEmailIncorrect",
      `L'email est incorrect. Veuillez la saisir à nouveau ou vous inscrire en cliquant ` // (ici) --> suite sur login.ejs
    );
    return res.redirect(`back`);
  } else {
    // L'email existe : vérification du mot de passe
    const user = await query(
      "SELECT ??, ??, ??, ??, ??, ?? FROM user WHERE ?? = ?",
      [
        `userId`,
        `firstname`,
        `lastname`,
        `email`,
        `password`,
        `roles`,
        `email`,
        email,
      ]
    );

    // Comparaison des mots de passe
    const match = await bcrypt.compare(password, user[0].password);
    console.log(match);
    if (match) {
      // Login
      req.session.userId = user[0].userId;
      req.session.firstname = user[0].firstname;
      req.session.role = user[0].roles;

      // Récupérer les infos de l'utilisateur et les stocker dans la session
      req.session.user = {
        id: user[0].userId,
        firstname: user[0].firstname,
        lastname: user[0].lastname,
        email: user[0].email,
        role: user[0].roles,
      };
      console.log(req.session.user);
      if (req.session.role == "admin") {
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/");
      }
    } else {
      req.flash(
        "messageMdpIncorrect",
        `Le mot de passe est incorrect. Veuillez le saisir à nouveau.`
      );
      res.redirect(`back`);
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
