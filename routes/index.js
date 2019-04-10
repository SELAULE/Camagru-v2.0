const express = require('express');
const router = express.Router();
const { ensureAuthinticated } = require('../config/auth');

// Home page
router.get('/', (req, res) => {
    res.render('index');
});

// Dashboard Page
router.get('/dashboard', ensureAuthinticated, (req, res) =>
	res.render('dashboard' , {
		name: req.user.name
	 })
);

// cam
router.get('/cam', ensureAuthinticated, (req, res) => 
	res.render('cam', {
		name: req.user.name
	})
	// name: req.user.name
);

// Update user info

router.get('/update', ensureAuthinticated, (req, res) => {
	res.render('update');
})

router.post('/update', (req, res, next) => {
	let {username, email, password} = req.body;

	console.log(username);
	console.log(email);
	console.log(password);
})

module.exports = router;
