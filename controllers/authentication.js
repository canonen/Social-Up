const User = require("../models/user")
const LocalStrategy = require("passport-local").Strategy
const passport = require("passport")
const bcrypt = require("bcryptjs")

passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {

        const user = await User.findOne({ email: email })
        if (!user || !await bcrypt.compare(password, user.password)) {
            
            return done(null, false, { message: "Incorrect email or password" });           
        }

        return done(null, user);
    } catch (er) {
        return done(er);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;