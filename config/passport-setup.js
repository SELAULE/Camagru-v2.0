const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');

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
    }, (accessToken, refreshToken, profile, done) => {
        //  Check if the user exists

        User.findOne({googleid: profile.id}).then((currentUser) => {
            if (currentUser) {
                console.log('We the user' + currentUser);
            } else {
                const newUser = new User ({
                    username: profile.displayName,
                    googleid: profile.id,
                    name: profile.name.givenName
                    // email: 
        
                }).save().then((newUser) => {
                    console.log('User saved' + newUser);
                });
            }
        })
        
    })
)