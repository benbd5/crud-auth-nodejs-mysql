const express = require("express"),
  app = express(),
  port = 3000,
  util = require("util"),
  session = require("express-session"),
  flash = require("connect-flash"),
  MySQLStore = require("express-mysql-session")(session),
  bodyParser = require("body-parser"),
  fileupload = require("express-fileupload"),
  methodOverride = require("method-override"),
  mysql = require("mysql");

// Dotenv
require("dotenv").config();

// EJS
app.set("view engine", "ejs");

// Static folder
app.use(express.static("public"));

// Middleware - BodyParser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Method-override pour update et delete
app.use(methodOverride("_method"));

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PSWD,
  database: process.env.DB,
});

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Variable globale pour mysql : util.promisify de node.js lié avec .bind()
global.query = util.promisify(connection.query).bind(connection);

// Express session MySQL pour récupérer les cookies dans la db
const sessionStore = new MySQLStore({}, connection);

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false, // force à ce qu'une nouvelle session soit crée
    saveUninitialized: true, // force à ce qu'une nouvelle session soit enregistrée
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // le cookie dure 24h
    },
    store: sessionStore, // SessionsStore pour récupérer les cookies dans la db
  })
);

// Messages flash
app.use(flash());

// Pour les images
app.use(fileupload());

// Pour identifier l'utilisateur connecté sur toutes les pages du site
app.use("*", (req, res, next) => {
  res.locals.user = req.session.userId;
  res.locals.name = req.session.firstname;
  // console.log(` id : ${res.locals.user}, name : ${res.locals.name}`);
  next();
});

// Routes
const index = require("./routes/indexRoute");
const articles = require("./routes/articlesRoute");
const auth = require("./routes/authRoute");

app.use("/", index);
app.use(articles);
app.use("/auth", auth);

app.get("*", function (req, res) {
  res.render("404");
});

// Listen
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port: ${port}`);
});
