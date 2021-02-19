// -------------------------- LISTE --------------------------
const get_list_article = async (req, res) => {
  const listArticles = await query(
    "SELECT article.titre, article.description, article.image, article.categories FROM article"
  );
  res.render("index", { listArticles });
};

// -------------------------- POST --------------------------
// Afficher la page post des articles
const get_post_page = (req, res) => {
  res.render("post");
};

// Poster un article
const post_article = async (req, res) => {
  const { titre, description, categories } = req.body;

  await query("INSERT INTO article (titre, description) VALUES (?,?)", [
    titre,
    description,
  ]);
  console.log("ok 1");
  res.redirect("/");
};

// -------------------------- UPDATE --------------------------
// -------------------------- DELETE --------------------------

module.exports = {
  get_list_article,
  get_post_page,
  post_article,
};
