const express = require("express"),
  app = express(),
  port = 3000;

// EJS
app.set("view engine", "ejs");

// Static folder
app.use(express.static("public"));

// Middleware - BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const index = require("./routes/indexRoute");
const post = require("./routes/postRoute");

app.use("/", index);
app.use("/post", post);

app.get("*", function (req, res) {
  res.render("404");
});

// Listen
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port: ${port}`);
});
