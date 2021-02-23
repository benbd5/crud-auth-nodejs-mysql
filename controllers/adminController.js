const get_admin_page = async (req, res) => {
  // const id = req.params.id;

  const articles = await query(
    "SELECT articleId, titre, description, image, userId FROM article"
  );

  const users = await query(
    "SELECT userId, firstname, lastname, email, profilPicture FROM user"
  );

  return res.render("admin/dashboard", { articles, users });
};

// DELETE profil
const delete_profil = async (req, res) => {
  const id = req.params.id;
  await query("DELETE FROM user WHERE userId = ?", [id]);
  console.log("user deleted");
  res.redirect("/admin/dashboard");
};

module.exports = {
  get_admin_page,
  delete_profil,
};
