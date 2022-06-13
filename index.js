const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const passport = require("passport");
const initializePassport = require("./passport-config");
initializePassport(passport);

const users = [];

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { name: "people" });
});
app.get("/login", (req, res) => {
  res.render("login.ejs", { name: "people" });
});
app.get("/register", (req, res) => {
  res.render("register.ejs", { name: "people" });
});

app.post("/", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
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

app.listen(8000, () => console.log("Server is running on port 8000"));
