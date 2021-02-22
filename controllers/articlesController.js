// Fileupload pour les images et path pour déplcacer les images dans le dossier upload
const fileupload = require("express-fileupload");
const path = require("path");

// -------------------------- LISTE --------------------------
const get_list_article = async (req, res) => {
  const listArticles = await query(
    "SELECT article.titre, article.description, article.image, article.categories, article.articleId FROM article"
  );
  res.render("index", {
    listArticles,
    messageNotAdmin: req.flash("messageNotAdmin"),
  });
};

const get_details_article = async (req, res) => {
  const id = req.params.id;

  const singleArticle = await query(
    "SELECT * FROM article WHERE articleId=?",
    id
  );

  res.render("singleArticle", {
    article: singleArticle[0],
  });
};

// -------------------------- POST --------------------------
// Afficher la page post des articles
const get_post_page = (req, res) => {
  res.render("post");
};

// Poster un article
const post_article = async (req, res) => {
  const { titre, description, categories } = req.body;

  const image = req.files.image;
  const imageName = image.name; // pour récupérer le nom de l'image dans le dossier uploads

  // TODO : vérifier si path.resolve est utile
  const fileUpload = path.resolve(
    __dirname,
    "..",
    "public/uploads/",
    imageName
  );

  // Use the mv() method to place the file somewhere on your server
  image.mv(fileUpload, function (err) {
    if (err) return res.status(500).send(err);

    res.redirect("/");
  });

  await query(
    "INSERT INTO article (titre, description, image) VALUES (?,?,?)",
    [titre, description, imageName]
  );
};

// -------------------------- UPDATE --------------------------
// Affiche la page de modification des articles
const get_update_article = async (req, res) => {
  const id = req.params.id;
  const singleArticle = await query("SELECT * FROM article WHERE articleId=?", [
    id,
  ]);
  res.render("updateArticle", { article: singleArticle[0] });
};

// Modifier les articles
const update_article = async (req, res) => {
  const { titre, description, categories } = req.body;

  const id = req.params.id;
  const image = req.files.image;
  const imageName = image.name;

  const fileUpload = path.resolve(
    __dirname,
    "..",
    "public/uploads/",
    imageName
  );

  image.mv(fileUpload, function (err) {
    if (err) return res.status(500).send(err);

    res.redirect("/");
  });

  await query(
    "UPDATE article SET titre = ?,  description = ?, image = ? WHERE articleId=?",
    [titre, description, imageName, id]
  );
};

// -------------------------- DELETE --------------------------
const delete_articles = async (req, res) => {
  const id = req.params.id;
  await query("DELETE FROM article WHERE articleId=?", [id]);
  console.log("Supprimé");
  res.redirect("/admin/dashboard");
};

module.exports = {
  get_list_article,
  get_details_article,
  get_post_page,
  post_article,
  get_update_article,
  update_article,
  delete_articles,
};
