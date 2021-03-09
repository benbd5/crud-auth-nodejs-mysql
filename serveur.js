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

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger documentation
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Documentation projet examen",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
  console.log("Connecté à MySQL");
});

// Variable globale pour mysql : util.promisify de node.js lié avec .bind()
global.query = util.promisify(connection.query).bind(connection);

// Express session MySQL pour récupérer les cookies dans la la base de données
const sessionStore = new MySQLStore({}, connection);

// Express Session
app.use(
  session({
    secret: process.env.SECRET, // signe le cookie pour identifier une session
    resave: false, // force à ce qu'une nouvelle session soit crée
    saveUninitialized: true, // force à ce qu'une nouvelle session soit enregistrée
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // le cookie dure 24h
    },
    store: sessionStore, // SessionsStore pour récupérer les cookies dans la base de données
  })
);

// Messages flash
app.use(flash());

// Pour les images
app.use(fileupload());

// Pour les formats de date
app.locals.moment = require("moment");

// Pour identifier l'utilisateur connecté sur toutes les pages du site
app.use("*", (req, res, next) => {
  res.locals.user = req.session.userId;
  res.locals.name = req.session.firstname;
  res.locals.profilPicture = req.session.profilPicture;
  res.locals.role = req.session.role;

  next();
});

// Routes
const admin = require("./routes/adminRoutes");
const articles = require("./routes/articlesRoute");
const auth = require("./routes/authRoute");
const user = require("./routes/userRoute");
const category = require("./routes/categoryRoute");

app.use("/admin", admin);
app.use("/auth", auth);
app.use(user);
app.use(articles);
app.use(category);

app.get("*", function (req, res) {
  res.render("404");
});

// Listen
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port: ${port}`);
});
