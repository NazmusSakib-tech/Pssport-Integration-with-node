const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
function initializePassport(passport, getUserByEmail, getUserById) {
  const authenticateUser = (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with this email" });
    }
    try {
      if (bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Wrong password" });
      }
    } catch (error) {}
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = getUserById(id);
    if (user == null) {
      return done(new Error("User not found"));
    }
    done(null, user);
  });
}

module.exports = initializePassport;
