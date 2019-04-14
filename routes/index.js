const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const { ensureAuthinticated } = require('../config/auth');

const onError  = (req, res) => {
	res.status(500)
	.contentType('text/plain')
	.end('Somethng went wrong');
}

const upload = multer({
	dest: '/uploads/'
})
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
);

router.post('/cam', (req, res, next) => {

});

module.exports = router;
