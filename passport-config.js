const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
function initializePassport(passport, authenticateUser) {
  const authenticateUser = (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with this email" });
    }
    try {
      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Wrong password" });
      }
    } catch (error) {}
  };
  passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {});
}

module.exports = initializePassport;
