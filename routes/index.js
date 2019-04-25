const express = require('express');
const router = express.Router();
const fs = require('fs');
// const multer = require('multer');
const { ensureAuthinticated } = require('../config/auth');
const db = require('../app');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const multer = require('multer');
const keys = require('../config/keys');
const GridFsStorage = require('multer-gridfs-storage');
const methodOverride = require('method-override');




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



// Init gfs
let gfs;

db.once('open', () => {
   gfs = Grid(db.db, mongoose.mongo);
   gfs.collection('uploads');
})


// Creating a storage Engine
const storage = new GridFsStorage({
  url: keys.mongodb.DBuri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// let storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 	  cb(null, 'uploads/')
// 	},
// 	filename: function (req, file, cb) {
// 	  cb(null, file.fieldname + '-' + Date.now())
// 	}
//   })
  
//   var upload = multer({ storage: storage })

router.post('/cam', upload.single('img64'), (req, res) => {
		// console.log(req.body.img64)
		if (req.body.img64) {
			var fs = require('fs'),
				data = req.body.img64,
				base64Data,
				binaryData;
	
			base64Data = data.replace(/^data:image\/png;base64,/, "");
			base64Data += base64Data.replace('+', ' ');
			binaryData = new Buffer(fs.readFileSync(req.body.img64)).toString("base64")
	
			fs.writeFile("fuck.png", binaryData, "binary", function (err) {
				console.log(err); // writes out file without error, but it's not a valid image
			});
			// var filename = req.file.filename;
			var uploadStatus = 'File successfully Uploaded';
		} else {
			console.log('No File Uploaded');
			var filename = 'FILE NOT UPLOADED';
			var uploadStatus = 'File Upload Failed';
		}
		res.render('cam', { status: uploadStatus, filename: `The file is  + ${filename}` });
});

// cam
router.get('/cam', ensureAuthinticated, (req, res) => 
	res.render('cam', {
		name: req.user.name
	})
);

// router.post('/cam', upload.single('img64'), (req, res) => {
// 	console.log(req.body.img64);
// 	if (req.body.img64) {
// 		console.log('File is uploading... ');
// 		var filename = req.body.img64.filename;
// 		var uploadStatus = 'File successfully Uploaded';
// 	} else {
// 		console.log('No File Uploaded');
//         var filename = 'FILE NOT UPLOADED';
//         var uploadStatus = 'File Upload Failed';
// 	}
// 	res.send({status: uploadStatus, filename: `The file is  + ${filename}` });
// });

module.exports = router;
