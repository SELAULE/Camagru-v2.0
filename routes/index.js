var express = require('express');
var router = express.Router();

// Home page

router.get('/', ensureAuthinticated, (req, res) => {
    res.render('index');
});

function ensureAuthinticated(req, res, next) {
	if (req.isAuthenticated) {
		return next();
	} else {
		// req.flash('')
		res.redirect('/users/login');
	}
}

module.exports = router;
