// const express = require('express');
// const authRouter = require('./routes/auth-routes');
// const passport = require('./config/passport-setup');


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/camagru-v2');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
const app = express();

// Setup a view Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Set static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Setup Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init 
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator ({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
            return {
            param: formParam,
            msg: msg,
            value:  value,
        };
    }
}));

// Connect Flash
app.use(flash());

//  Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

// app.use('/auth', authRouter);

// // Route to home
// app.get( '/', (req, res) => {
//     req.get
//     res.render('Home')
// } );

// Port to listing to 

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), () => {
    console.log('Listing to port ' + app.get('port'));
});
