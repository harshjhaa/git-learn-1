// var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/User')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            console.log('searching  user')
            User.findOne({ email }, (err, user) => {
                if (err) { return done(err); }
                if (!user) {
                    console.log('no such user in database')
                    return done(null, false, { message: 'Wromg email' });
                }
                if (user.password != password) {
                    console.log('password not match error')
                    return done(null, false, { message: 'Wromg password' });
                }
                return done(null, user);
            });
        }
        ));
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
        // where is this user.id going? Are we supposed to access this anywhere?
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}