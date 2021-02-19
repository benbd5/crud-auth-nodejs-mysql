const get_admin_page = async (req, res) => {
  const id = req.params.id;

  const articles = await query("SELECT * FROM article");
  return res.render("admin/dashboard", { articles });
};

module.exports = { get_admin_page };
