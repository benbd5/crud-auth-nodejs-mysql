const get_verify_auth = (req, res, next) => {
  if (req.session.user == undefined) {
    // ou (!req.session.user) ?
    req.flash(
      "messageNotConnected",
      "Vous devez etre connecté pour accéder à cette page"
    );
    return res.redirect("/auth/login");
  } else {
    next();
  }
};

const verify_role = (req, res, next) => {
  if (res.locals.role == "user") {
    req.flash(
      "messageNotAdmin",
      "Vous n'avez pas les droits pour accéder à cette page"
    );
    return res.redirect("/");
  } else {
    next();
  }
};

module.exports = {
  get_verify_auth,
  verify_role,
};
