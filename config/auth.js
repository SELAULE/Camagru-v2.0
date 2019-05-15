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
        from: '"Fred Foo 👻" <nselaule@camagru-V2.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' , // Subject line
        html: "<b>Hello world?</b>" // html body
    }, (err, info) => {
        if (err) {
            console.log("This is the error... " + err);
        } else {
            console.log("This was a success... " + info);
        }
    });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Test account: %s", testAccount.user);
    // console.log("Test password: %s", testAccount.pass);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports.mail = mail;