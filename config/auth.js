const nodemailer = require('nodemailer');
const Token = require('../models/user').Token;
const User = require('../models/user').User;
const tokenModelPass = require('../models/user').tokenModelPass;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


module.exports = {
    ensureAuthinticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
            // req.flash('')
            res.redirect('/users/login');
    }
}

// For Registration
    async function mail(user, token) {
        let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        // service: 'gmail',
        auth: {
            user: 'sitholentsako4@gmail.com', // generated ethereal user
            pass: '19981214' // generated ethereal password
        }
    });

    var token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex')
    });
     
    // Save the verification token
    token.save( (err) => {
        if (err) { return res.status(500).send({ msg: err.message }); }
    })
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"nselaule 👻" <nselaule@camagru-V2.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nlocalhost:3000\/\/login\/' + token.token + '.\n' , // Subject line
        html: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:3000\/users\/verify\/' + token.token + '.\n' // html body
    }, (err, info) => {
        if (err) {
            console.log("This is the error... " + err);
        } else
            console.log("This was a success... " + info);
        
    });
}

// For forgot Password
async function forgotPassMail(user, tokenModelPass) {
    let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    // service: 'gmail',
    auth: {
        user: 'sitholentsako4@gmail.com', // generated ethereal user
        pass: '19981214' // generated ethereal password
    }
});

var tokenModelPass = new tokenModelPass({
    email: user.email,
    token: crypto.randomBytes(16).toString('hex')
});
 
// Save the verification token
tokenModelPass.save().then(token => {
    console.log(token);
}).catch(err => console.log(err));

// send mail with defined transport object
let info = await transporter.sendMail({
    from: '"nselaule 👻" <nselaule@camagru-V2.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Account Verification Token',
    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nlocalhost:3000\/\/login\/' + tokenModelPass.token + '.\n' , // Subject line
    html: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:3000\/users\/forgotPass\/' + tokenModelPass.token + '.\n' // html body
}, (err, info) => {
    if (err) {
        console.log("This is the error... " + err);
    } else
        console.log("This was a success... " + info);
    
});
}

// For Notifications
async function notificationMail(user, subject, activity) {
    let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    // service: 'gmail',
    auth: {
        user: 'sitholentsako4@gmail.com', // generated ethereal user
        pass: '19981214' // generated ethereal password
    }
});


// console.log("Sent to..." + user.email);
// send mail with defined transport object
let info = await transporter.sendMail({
    from: '"nselaule 👻" <nselaule@camagru-V2.com>', // sender address
    to: user.email, // list of receivers
    subject: subject,
    // text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nlocalhost:3000\/\/login\/' + token.token + '.\n' , // Subject line
    html: 'Hello There dummie,\n\n' + user.name + ' ' + activity + ' your post. \n' // html body
}, (err, info) => {
    if (err) {
        console.log("This is the error... " + err);
    } else {
        console.log("This was a success... " + info);
    }
});

}

function confirmEmail(tokenModel, User, id) {
    tokenModel.findOne({ token: id }).then ((token) => {
        // if (err) throw err;
        console.log(id);
            console.log( 'This is the token  ' + token);
            User.findOne({ _id: token.userId }).then ((user) => {
                // if (err) throw err;
                    user.active = true;
                    user.save().then((user) => {
                        console.log( 'I am coming back  ' + user);
                    })
            }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

function confirmEmailPass(tokenModelPass, User, id, password) {
    tokenModelPass.findOne({ token: id }).then ((token) => {
            User.findOne({ email: token.email }).then ((user) => {
                if (!password == null) {
                    bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) console.log(err);
                        newpassword = hash;
                        user.password = newpassword;
                        
                        user.save().then((user) => {
                            console.log( 'I am suppose to be back  ' + user);
                        }).catch(err => console.log(err))
                    }));
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

module.exports.mail = mail;
module.exports.notificationMail = notificationMail;
module.exports.confirmEmail = confirmEmail;
module.exports.confirmEmailPass = confirmEmailPass;
module.exports.forgotPassMail = forgotPassMail;