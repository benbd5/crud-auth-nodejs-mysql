const get_category = async (req, res) => {
  const id = req.params.id;

  // récupère le nom du département s'il n'y a aucun article lié à celui-ci
  const singleCategory = await query(
    "SELECT categoryId, name, userId FROM category WHERE categoryId = ?",
    id
  );

  const categories = await query(
    "SELECT article.title, article.image, article.description, article.dateAdd, article.articleId, user.userId, user.lastname, user.firstname, user.profilPicture, category.categoryId, category.name FROM user INNER JOIN article ON user.userId = article.userId INNER JOIN category ON article.categoryId = category.categoryId WHERE category.categoryId = ?",
    id
  );

  res.render("category", { categories, singleCategory: singleCategory[0] });
};

module.exports = {
  get_category,
};
