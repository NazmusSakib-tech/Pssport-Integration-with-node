if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: "people" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.get("/register", (req, res) => {
  res.render("register.ejs", { name: "people" });
});

app.post("/register", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
  console.log(users);
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(8000, () => console.log("Server is running on port 8000"));
