const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const token = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mail = require('../config/auth').mail
const { ensureAuthinticated } = require('../config/auth');

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
                            mail(user);
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    }));
             }
         })
         
     }
     //  Generating the token

    //  let token = new token({
    //      _userId: user._id,
    //      token: crypto.randomByte(16).toString('hex')
    //     });
    //     //  Saving the token
    //     token.save((err) => {
    //         if (err) throw err;
    //     });
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