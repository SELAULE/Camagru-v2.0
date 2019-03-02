const express = require('express');
const authRouter = require('./routes/auth-routes');
const passport = require('./config/passport-setup');

const app = express();

// Setup a view Engine
app.set('view engine', 'ejs');

app.use('/auth', authRouter);

// Route to home
app.get( '/', (req, res) => {
    res.render('Home')
} );

// Port to listing to 
app.listen(3000, () => {
    console.log('Listing to port 3000');
});