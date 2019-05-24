const nodemailer = require('nodemailer');
const Token = require('../models/user').Token;
const crypto = require('crypto');

module.exports = {
    ensureAuthinticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
            // req.flash('')
            res.redirect('/users/login');
    }
}

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
    
    // console.log("Sent to..." + user.email);
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
        } else {
            console.log("This was a success... " + info);
        }
    });

}

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
                        console.log( 'This is the user  ' + user);
                    })
            }).catch(err => console.log(err)) 
    }).catch(err => console.log(err))
}

module.exports.mail = mail;
module.exports.notificationMail = notificationMail;
module.exports.confirmEmail = confirmEmail;