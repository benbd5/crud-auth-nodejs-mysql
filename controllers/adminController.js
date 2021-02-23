const get_admin_page = async (req, res) => {
  // const id = req.params.id;

  const articles = await query("SELECT * FROM article");

  const users = await query(
    "SELECT userId, firstname, lastname, email, profilPicture FROM user"
  );

  return res.render("admin/dashboard", { articles, users });
};

const get_articles_users = async (req, res) => {
  const id = req.params.id;

  await query(
    "SELECT titre, image, description, categories, articleId FROM article INNER JOIN user ON article.userId = user.userId WHERE user.userId = ?",
    id
  );

  res.render("listeArticlesUser");
};

// DELETE profil
const delete_profil = async (req, res) => {
  const id = req.params.id;
  await query("DELETE FROM user WHERE userId = ?", [id]);
  console.log("user deleted");
  res.redirect("/admin/dashboard");
};

module.exports = { get_admin_page, delete_profil, get_articles_users };
