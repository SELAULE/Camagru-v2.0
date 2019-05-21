const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user').User;
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
})

passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, email, done) => {
        //  Check if the user exists
        // console.log(email);
        User.findOne({googleid: email.id}).then((currentUser) => {
            if (currentUser) {
                console.log('We the user' + currentUser);
                done (null, currentUser);
            } else {
                const newUser = new User ({
                    active: true,
                    username: email.displayName,
                    googleid: email.id,
                    name: email.name.givenName,
                    email: email.emails[0].value
                }).save().then((newUser) => {
                    console.log('User saved' + newUser);
                    done (null, newUser);
                });
            }
        })
    })
)

module.exports = function ( passport ) {
    passport.use(new LocalStrategy( { usernameField: 'username' },
  (username, password, done) => {
    //   Match the username
    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return done(null, false, {message: 'That username is not registered you can have it if want'})
            }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password is incorrect at least I told you'});
                }
            });
        })
        .catch( err => console.log(err));
    })
)


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

}