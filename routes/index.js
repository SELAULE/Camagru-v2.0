const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const { ensureAuthinticated } = require('../config/auth');
const imageModel = require('../models/user').Images;
const commentModel = require('../models/user').Comments;
const likeModel = require('../models/user').Likes;
const User = require('../models/user').User;




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

async function uploadComment(user, comments, image_id) {
	
	commentModel.findOne({ image_id: image_id }).then((comment) => {
		if (comment) {
			let theeComment = comment.comment + ', ' + JSON.stringify({name: user.name, comment: comments});
			commentModel.updateOne({ comment: theeComment }, (err) => {
				if (err) {
					throw(err);
				}
			})
		} else {
			commentobj = JSON.stringify({name: user.name, comment: comments});
			newComment = new commentModel({
				image_id: image_id,
				comment: commentobj
			});
			newComment.save().then(info => {
				console.log('Lets see ' + info);
			});
		}
	})
}

const upload = multer({
	dest: './uploads/'
})

// Home page
router.get('/', (req, res, next) => {
	imageModel.find({ }, (err, image) => {
		if (err) return next(err);
		let theepath = [];
		image.forEach((images) => {
			theepath.push(images);
		});
		res.render('index', { images: theepath });
	});
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
		let likes = [];

		image.forEach((images) => {
			theepath.push(images);
			// likeModel.countDocuments({ imageId: images._id }, (err, doc) => {
			// 	likes.push(doc);
			// })
		});
		// let allTheInfo = {
		// 	theepath = theepath,
		// 	likes = likes
		// }
		console.log('This is the info   ' + allTheInfo);
		res.render('profile', { images: theepath });
	});
});

// Getting the likes

router.get('/likes', (req, res) => {
	likeModel.countDocuments().then(count => console.log(count));
	res.send('Oops');
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

router.post('/comments', (req, res) => {
	const { comment, image_id } = req.body;
	let user = req.user
	uploadComment(user, comment, image_id);
	res.send('got it');
});

router.post('/likes', ensureAuthinticated, (req, res) => {
	let id = JSON.stringify(req.body);
	id = id.replace(/[^\w\s]/gi, '');
    likeModel.findOne({ imageId: id })
    .then((doc) => {
		if (doc) {
			likeModel.deleteOne({}).then(result => console.log('deleted'))
			.catch(err => console.log(err))
		} else {
			const newLike = new likeModel ({
				imageId: id,
				userId: req.user.id,
				status: true
			})
			newLike.save()
			.then(like => console.log(like))
			.catch(err => console.log(err));
		}
    })
    .catch(err => {
        console.log(err);
    });
});

module.exports = router;
