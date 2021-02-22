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

  res.render("profil", { userProfil: userProfil[0], articles });
};

module.exports = {
  get_page_profil,
};
