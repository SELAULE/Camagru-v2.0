const authRouter = require('./routes/auth-routes');
const passport = require('./config/passport-setup');
const keys = require('./config/keys');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('flash');
const session = require('express-session');
const passportOauth = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


require('./config/passport-setup')(passportOauth);
// mongoose.connect('mongodb://localhost:27017/camagru-v2', { useNewUrlParser: true })
//     .then(() => console.log('Mongodb Connected'))
//     .catch( err => console.log(err));


// Conneting to the Atlas
mongoose.connect(keys.mongodb.DBuri, {useNewUrlParser: true},  () => {
    console.log('conneted to mongo');
    // console.log(keys.mongodb.DBuri);
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
module.exports = db;

// App Routes
const routes = require('./routes/index');
const users = require('./routes/users');

// Init App
const app = express();

// Setup a view Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
// app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());


// Methode Override middleware
app.use(methodOverride('_method'));


// Set static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));

// Setup Express Session
app.use(session({
    secret: 'Camagru-v2',
    saveUninitialized: true,
    resave: true
}));

// init Cookie Session

// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.Session.cookieKey]
// }));

// Passport Middleware
app.use(passportOauth.initialize());
app.use(passportOauth.session());

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
app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // next();
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

app.use('/auth', authRouter);


// Port to listing to 

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), () => {
    console.log('Listing to port ' + app.get('port'));
});
