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
    "SELECT titre, image, description, categories, articleId, user.userId, user.lastname, user.firstname, user.profilPicture FROM user INNER JOIN article ON user.userId = article.userId WHERE articleId = ?",
    id
  );
  res.render("singleArticle", {
    article: singleArticle[0],
  });
};

// Afficher la liste des articles de l'auteur/utilisateur
const get_articles_users = async (req, res) => {
  const id = req.params.id;

  const totalArticles = await query(
    "SELECT COUNT(user.userId) AS 'Total' FROM user INNER JOIN article ON user.userId = article.userId WHERE user.userId = ?",
    id
  );

  const articlesUsers = await query(
    "SELECT titre, image, description, categories, articleId, user.lastname, user.firstname, user.profilPicture FROM user INNER JOIN article ON user.userId = article.userId WHERE user.userId = ?",
    id
  );

  res.render("listeArticlesUser", {
    articlesUsers,
    totalArticles: totalArticles[0].Total,
  });
};

// -------------------------- POST --------------------------
// Afficher la page post des articles
const get_post_page = (req, res) => {
  res.render("post", { messageFields: req.flash("messageFields") });
};

// Poster un article
const post_article = async (req, res) => {
  const { titre, description, categories } = req.body;
  const image = req.files.image;

  const userId = res.locals.user;

  if (!titre || !description || !image) {
    req.flash("messageFields", "Veuillez remplir tous les champs.");
    res.redirect(`back`);
  } else {
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
    });

    await query(
      "INSERT INTO article (titre, description, image, userId) VALUES (?,?,?,?)",
      [titre, description, imageName, userId]
    );
    res.redirect("/profil");
  }
};

// -------------------------- UPDATE --------------------------
// Affiche la page de modification des articles
const get_update_article = async (req, res) => {
  const id = req.params.id;
  const singleArticle = await query(
    "SELECT articleId, titre, description, image, userId FROM article WHERE articleId=?",
    [id]
  );
  res.render("updateArticle", {
    article: singleArticle[0],
    noImage: req.flash("noImage"),
  });
};

// Modifier les articles
const update_article = async (req, res) => {
  const { titre, description, categories } = req.body;

  const id = req.params.id;

  if (!req.files) {
    req.flash("noImage", "Veuillez sélectionner une image");
    res.redirect(`back`);
  } else {
    const image = req.files.image;
    const imageName = image.name;

    const fileUpload = path.resolve(
      __dirname,
      "..",
      "public/uploads/",
      imageName
    );

    image.mv(fileUpload, function (err) {
      // Modifier pour afficher un message req.flash ?
      if (err) return res.status(500).send(err);
    });

    await query(
      "UPDATE article SET titre = ?, description = ?, image = ? WHERE articleId=?",
      [titre, description, imageName, id]
    );
    res.redirect("/profil");
  }
};

// -------------------------- DELETE --------------------------
const delete_articles = async (req, res) => {
  const id = req.params.id;
  await query("DELETE FROM article WHERE articleId=?", [id]);
  console.log("Supprimé");

  if (res.locals.role == "user") {
    res.redirect("/profil");
  } else if (res.locals.role == "admin") {
    res.redirect("/admin/dashboard");
  }
};

module.exports = {
  get_list_article,
  get_details_article,
  get_articles_users,
  get_post_page,
  post_article,
  get_update_article,
  update_article,
  delete_articles,
};
