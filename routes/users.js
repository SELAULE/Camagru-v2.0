const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// const flash = require('connect-flash');

// Register

router.get('/register', (req, res) => {
    res.render('register');
});

// Login

router.get('/login', (req, res) => {
    res.render('login');
});

// Register User

router.post('/register', (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password is required').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password
        });
        User.createUser( newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered and can log in');
        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, (err, user) => {
        if (err) throw  err;
        if (!user) {
            return done(null, false, {message: 'Unknown user'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid Password'});
            }
        });
    });
  }
));

passport.serializeUser( (user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);
  });

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/Login');
});

module.exports = router;