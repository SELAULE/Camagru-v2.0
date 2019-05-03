const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const { ensureAuthinticated } = require('../config/auth');
const imageModel = require('../models/user').Images;
const User = require('../models/user').User;
// const onError = (req, res) => {
// 	res.status(500)
// 		.contentType('text/plain')
// 		.end('Somethng went wrong');
// }

async function saveThePath(user, filename) {
	let user_id = user._id;

	const newImage = new imageModel ({
		userId: user_id,
		image_path: filename
	});
	newImage.save().then(info => {
	console.log('This is the new Image info ' + info);
	})
}

const upload = multer({
	dest: './uploads/'
})
// Home page
router.get('/', (req, res) => {
	res.render('index');
});

// Dashboard Page
router.get('/dashboard', ensureAuthinticated, (req, res) =>
	res.render('dashboard', {
		name: req.user.name
	})
);

// Profile Page

router.get('/profile', ensureAuthinticated, (req, res, next) => {

	imageModel.find({ userId: req.user._id }, (err, image) => {
		if (err) return next(err);
		let theepath = [];
		image.forEach((images) => {
			theepath.push(images.image_path);
		});
		console.log(theepath);
		res.render('profile', { images: theepath });
	});
});

// cam
router.get('/cam', ensureAuthinticated, (req, res) =>
	res.render('cam', {
		name: req.user.name
	})
);

router.post('/cam', upload.single('img64'), (req, res) => {
	// console.log(req.body.img64)
	if (req.body.img64) {
		var fs = require('fs'),
			data = req.body.img64,
			base64Data,
			binaryData;

		base64Data = data.replace(/^data:image\/png;base64,/, "");
		base64Data += base64Data.replace('+', ' ');
		binaryData = new Buffer(base64Data, 'base64').toString('binary');
		let filename = crypto.randomBytes(6).toString('hex');
		let path = 'uploads/' + filename + '.png';
		fs.writeFile("uploads/" + filename + ".png", binaryData, "binary", (err) => {
			console.log(err); // writes out file without error, but it's not a valid image
		});
		var uploadStatus = 'File successfully Uploaded';
		var user = req.user;
		saveThePath(user, path);
	} else {
		console.log('No File Uploaded');
		var filename = 'FILE NOT UPLOADED';
		var uploadStatus = 'File Upload Failed';
	}
	res.render('cam', {title: 'Cam'});
});

// Comments

router.post()

module.exports = router;
