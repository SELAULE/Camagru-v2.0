const router = require('express').Router();
const passport = require('passport');

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

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('You insigned In');
});

module.exports = router;