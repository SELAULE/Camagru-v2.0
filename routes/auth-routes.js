const passport = require('passport');
const router = require('express').Router();

router.get('/login', (req, res) => {
    res.render('login');
});

// Logging out

router.get('/logout', (req, res) => {
    res.send('Logging out');
})

//Auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', 
passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // console.log(res); 
    res.render('dashboard');
});

module.exports = router;