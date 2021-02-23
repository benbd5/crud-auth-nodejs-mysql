const get_admin_page = async (req, res) => {
  // const id = req.params.id;

  const articles = await query("SELECT * FROM article");

  const users = await query(
    "SELECT userId, firstname, lastname, email, profilPicture FROM user"
  );

  return res.render("admin/dashboard", { articles, users });
};

const get_articles_users = async (req, res) => {
  const totalArticles = await query(
    "SELECT COUNT(*) AS 'Total' FROM user INNER JOIN article ON user.userId = article.userId"
  );

  const articlesUsers = await query(
    "SELECT titre, image, description, categories, articleId, user.lastname, user.firstname, user.profilPicture FROM user INNER JOIN article ON user.userId = article.userId"
  );

  res.render("listeArticlesUser", {
    articlesUsers,
    totalArticles: totalArticles[0].Total,
  });
};

// DELETE profil
const delete_profil = async (req, res) => {
  const id = req.params.id;
  await query("DELETE FROM user WHERE userId = ?", [id]);
  console.log("user deleted");
  res.redirect("/admin/dashboard");
};

module.exports = { get_admin_page, delete_profil, get_articles_users };
