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
);

router.post('/cam', (req, res, next) => {
	let data = req.body.base64.replace(/^data:image\/png;base64,/, "");
	fs.writeFile('uploads/out.png', data, base64, (err) => {
		if (err) {
			console.log(err)
		} else {
			res.send(JSON.stringify({'status': 1, 'msg': 'Image Uploaded'}));
		}
	});
});

module.exports = router;
