const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const token = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

    if (!email || !username || !name || password || password2) {
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
                        if (err) throw err;
                        newUser.password = hash;
                        // Saving the user
                        newUser.save()
                        .then(user => {
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    }));

                    
                //  res.send('passed');
             }
         })
         
     }
     //  Generating the token

     let token = new token({
        _userId: user._id,
        token: crypto.randomByte(16).toString('hex')
    });

    //  Saving the token
    token.save((err) => {
        if (err) throw err;
    });

    // Sending the mail

    let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
    let mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
    transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
    });
    console.log(newUser);
    // let name = req.body.name;
    // let username = req.body.username;
    // let email = req.body.email;
    // let password = req.body.password;
    // let password2 = req.body.password2;
    
    // req.checkBody('email', 'Email is required').notEmpty();
    // req.checkBody('email', 'Email not valid').isEmail();
    // req.checkBody('username', 'Username is required').notEmpty();
    // req.checkBody('name', 'name is required').notEmpty();
    // req.checkBody('password', 'Password is required').notEmpty();
    // req.checkBody('password2', 'Password is required').equals(req.body.password);

    // var errors = req.validationErrors();

    // if (errors) {
    //     res.render('register', {
    //         errors: errors
    //     });
    // } else {
    //     var newUser = new User({
    //         name: name,
    //         username: username,
    //         email: email,
    //         password: password
    //     });
    //     User.createUser( newUser, (err, user) => {
    //         if (err) throw err;
    //         console.log(user);
    //     });
    //     req.flash('success_msg', 'You are registered and can log in');
    //     res.redirect('/users/login');
    // }
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
            if (!user.active) {
                return done(null, false, {message: 'Please Verify your email'});
            }
            res.send({ token: generateToken(user), user: user.toJSON() });

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