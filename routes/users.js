const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user').User;
const tokenModel = require('../models/user').Token;
const tokenModelPass = require('../models/user').PassToken;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const keys = require('../config/keys');
const nodemailer = require('nodemailer');
const mail = require('../config/auth').mail;
const confirmEmail = require('../config/auth').confirmEmail;
const forgotPassMail = require('../config/auth').forgotPassMail;
const { ensureAuthinticated } = require('../config/auth');

// Update

router.get('/update', (req, res) => {
	res.render('update', {title: 'Update', name: req.user});
});

// Forgot Pass Page
router.get('/forgotPass', (req, res) => {
	res.render('forgotPass');
});

// Register

router.get('/register', (req, res) => {
    res.render('register', {title: 'Register'});
});

// Login

router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
});

// Register User

router.post('/register', (req, res) => {
    const { name, username, email, password, password2 } = req.body;

    let errors = [];

    if (!email || !username || !name || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.legth < 6) {
        errors.push({ msg: 'Password must be at least 6 characters long' });
    }

    if (errors.legth > 0) {
        res.render('register', {
            errors,
            name,
            email,
            username,
            passport, 
            password2  
        });
     } else {
         User.findOne({ email: email })
         .then(user => {
             if (user) {
                 errors.push({ msg: 'Email already registered' })
                res.render('register', {
                    errors,
                    name,
                    email,
                    username,
                    passport,
                    password2
                });
             } else {
                 const newUser = new User({
                     name,
                     email,
                     username,
                     password
                 });
                //  Hash password

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.log(err);
                        newUser.password = hash;
                        // Saving the user
                        newUser.save()
                        .then(user => {
                            console.log(user);

                            mail(user, tokenModel);
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    }));
             }
         })
     }

});

// Updating the user information...

router.post('/update/id', ensureAuthinticated, (req, res, next) => {
    let {username, email, password, notification} = req.body;

    if (username) {
        User.findOneAndUpdate({ _id: req.user.id }, {$set:{ username: username }}, { returnOriginal: false, upsert: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
                console.log(doc);
            }
        });
    }
    if (password) {
        bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) console.log(err);
                        newpassword = hash;
        User.findOneAndUpdate({ _id: req.user.id }, {$set:{ password: newpassword }}, { returnOriginal: false }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
                console.log(doc);
            }
        });
    }));
}
    
    if (email) {
        User.findOneAndUpdate({ _id: req.user.id }, { $set:{email: email }}, { returnOriginal: false }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
                console.log(doc);
            }
        });
    }

    if (notification) {
        console.log(req.params.id);
        User.findByIdAndUpdate(req.params.todoId, req.body, {new: false})
        .then((todo) => {
            console.log(todo);
        })
        .catch( (err) => {
            console.log(err)
        });
    }

    res.render('dashboard');
})

// User Sign In
router.post('/login', (req, res, next) => {
    let errors = [];
    User.findOne({ username: req.body.username }).then((user) => {
        if (user.active === true) {
            passport.authenticate('local', {
            successRedirect: '/users/update',
            failureRedirect: '/users/login',
            failureFlash: true
        }) (req, res, next);
        } else {
            errors.push({ msg: 'Please verify your Email' })
        }
    }).catch(err => console.log(err))
});

// Verify Email Address
router.get('/verify/:id', (req, res) => {
    let id = req.params.id;
    confirmEmail(tokenModel, User, id);
    res.redirect('/users/login');
})

// Forgot Password
router.post('/forgotPass/:id', (req, res) => {
    let id = req.params.id;
    let user = req.body;
    forgotPassMail(user, tokenModelPass);
    confirmEmail(tokenModelPass, User, id);
    res.send(req.body);
})

// User sign out
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/Login');
});


router.post('/notification/:notifstat', (req, res) => {
    console.log(req.params.notifstat);
        User.findOneAndUpdate({ _id: req.user._id }, {$set:{ notify: req.params.notifstat }}, { returnOriginal: false }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
                console.log(doc);
            }
        });
})

module.exports = router;