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

module.exports = router;
