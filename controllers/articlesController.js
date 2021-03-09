// Fileupload pour les images et path pour déplcacer les images dans le dossier upload
const fileupload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// -------------------------- GET Articles --------------------------
// Liste des articles
const get_list_article = async (req, res) => {
  res.locals.title = "Accueil";

  const categories = await query(
    "SELECT categoryId, name, userId FROM category"
  );

  let listArticles = await query(
    "SELECT article.title, article.description, article.image, article.dateAdd, article.articleId, category.categoryId, category.name FROM article INNER JOIN category ON article.categoryId = category.categoryId ORDER BY dateAdd DESC"
  );
  // ORDER BY DESC pour récupérer les articles les plus récents d'abord

  res.render("index", {
    listArticles,
    messageNotAdmin: req.flash("messageNotAdmin"),
    alreadyConnected: req.flash("alreadyConnected"),
    categories,
  });
};

// Affiche un seul article
const get_details_article = async (req, res) => {
  const id = req.params.id;

  const singleArticle = await query(
    "SELECT article.title, article.image, article.description, article.dateAdd, article.articleId, user.userId, user.lastname, user.firstname, user.profilPicture, category.categoryId, category.name FROM user INNER JOIN article ON user.userId = article.userId INNER JOIN category ON article.categoryId = category.categoryId WHERE articleId = ?",
    id
  );

  res.locals.title = `Report ${singleArticle[0].title}`;

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
    "SELECT title, image, description, articleId, dateAdd, user.lastname, user.firstname, user.profilPicture, category.categoryId, category.name FROM user INNER JOIN article ON user.userId = article.userId INNER JOIN category ON article.categoryId = category.categoryId WHERE user.userId = ? ORDER BY dateAdd DESC",
    id
  );

  res.locals.title = `Liste des articles de ${articlesUsers[0].firstname}`;

  res.render("listeArticlesUser", {
    articlesUsers,
    totalArticles: totalArticles[0].Total,
  });
};

// -------------------------- POST articles --------------------------
// Afficher la page post des articles
const get_post_page = async (req, res) => {
  res.locals.title = "Poster un article";

  const categories = await query(
    "SELECT categoryId, name FROM category ORDER BY category.name DESC"
  );

  res.render("post", {
    messageFields: req.flash("messageFields"),
    categories,
  });
};

// Poster un article
const post_article = async (req, res) => {
  const { title, description, dateAdd, categoryId } = req.body;

  const userId = res.locals.user;

  if (!title || !description || !req.files.image || !categoryId) {
    req.flash("messageFields", "Veuillez remplir tous les champs.");
    return res.redirect(`back`);
  }

  if (
    req.files.image.mimetype === "image/png" ||
    req.files.image.mimetype === "image/jpg" ||
    req.files.image.mimetype === "image/jpeg" ||
    req.files.image.mimetype === "image/webp"
  ) {
    const image = req.files.image;
    const imageName = image.name.split(".")[0]; // pour récupérer le nom de l'image dans le dossier uploads en ayant enlevé le mimetype d'origine

    const imageNameWebp = imageName + title + ".webp";
    const imagePath = path.resolve(
      __dirname,
      "..",
      "public/uploads/" + imageNameWebp
    );

    try {
      sharp(req.files.image.data)
        .resize(800)
        .webp({ lossless: true })
        .toFile(imagePath);

      await query(
        "INSERT INTO article (??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?)",
        [
          "title",
          "description",
          "image",
          "dateAdd",
          "userId",
          "categoryId",
          title,
          description,
          imageNameWebp,
          dateAdd,
          userId,
          categoryId,
        ]
      );

      res.redirect("/profil");
    } catch (error) {
      req.flash("messageFields", "Veuillez réessayer ultérieurement.");
      return res.redirect(`back`);
    }
  } else {
    req.flash(
      "messageFields",
      "Veuillez choisir un format d'image tel que : jpg, jpeg, webp ou png."
    );
    return res.redirect(`back`);
  }
};

// -------------------------- UPDATE article --------------------------
// Affiche la page de modification des articles
const get_update_article = async (req, res) => {
  const id = req.params.id;
  const singleArticle = await query(
    "SELECT articleId, title, description, image, userId FROM article WHERE articleId=?",
    [id]
  );

  res.locals.title = `Modifier le report ${singleArticle[0].title}`;

  res.render("updateArticle", {
    article: singleArticle[0],
    noImage: req.flash("noImage"),
  });
};

// Modifier les articles
const update_article = async (req, res) => {
  const { title, description } = req.body;

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
      "UPDATE article SET title = ?, description = ?, image = ? WHERE articleId=?",
      [title, description, imageName, id]
    );
    res.redirect("/profil");
  }
};

// -------------------------- DELETE article --------------------------
const delete_articles = async (req, res) => {
  const id = req.params.id;
  console.log("Article supprimé");

  // Supprimer les images du dossier pour éviter de stocker des documents inutiles
  const imageNamePath = await query(
    "SELECT image FROM article WHERE articleId = ?",
    id
  );

  const imageName = imageNamePath[0].image;
  const pathFile = path.resolve(__dirname, "../public/uploads/", imageName);

  fs.unlink(pathFile, (err) => {
    if (err) console.log(err);
    console.log(pathFile, "pathFile was deleted");
  });
  // Fin de la requête de supression des images dans le dossier

  await query("DELETE FROM article WHERE articleId=?", [id]);

  // Redirection après la suppression
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
