// LIB STORAGE & UPLOAD IMG
const multer = require('multer');
// LIB RESIZE IMG
const sharp = require('sharp');
const catchAsync = require('../handler/catchAsync');
const appError = require('../handler/appError');
const fs = require('fs');
//const rimraf = require('rimraf');
//defined destination and name of file
// const multerStorage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'src/public/img/users')
// 	},
// 	filename: function (req, file, cb) {
// 		//name: user - userId - time.png
// 		//get .ext of Image
// 		const ext = file.mimetype.split('/')[1]
//     	cb(null, `user-${req.user._id}-${Date.now()}.${ext}`)
//   	}
// })

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new appError('File is not an Image! Please upload only Image.', 400), false);
	}
};

//config upload: keep in memory and ignore file is not Image
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
const uploads = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
//--upload and keep it in memory -> resize -> write to disk
exports.uploadImage = upload.single('avatar');

exports.uploadImages = uploads.fields([
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 10 },
]);

//--resize
exports.resizeImages = catchAsync(async (req, res, next) => {
	if (req.files.imageCover || req.files.images) {
		// create folder to process (1) and (2)
		var pathSaveProductImg = `src/public/img/products/${req.params.id}`;
		if (!fs.existsSync(pathSaveProductImg)) {
			fs.mkdirSync(pathSaveProductImg);
		}
	}

	// 1) imageCover file
	if (req.files.imageCover) {
		req.body.imageCover = `product-${req.params.id}-cover.jpg`;

		await sharp(req.files.imageCover[0].buffer)
			.resize(600, 800)
			.toFormat('jpg')
			.png({ quality: 90 })
			.toFile(`src/public/img/products/${req.params.id}/${req.body.imageCover}`);
	}

	// 2) images file,
	/*async(file, index) will return promise -> use map to return all of promise into an Array
	and ensure all of it finish then run line next() -> use promise.all*/
	if (req.files.images) {
		req.body.images = [];
		await Promise.all(
			req.files.images.map(async (singleFile, index) => {
				const imageName = `product-${req.params.id}-${index + 1}.jpg`;

				await sharp(singleFile.buffer)
					.resize(600, 800)
					.toFormat('jpg')
					.png({ quality: 90 })
					.toFile(`src/public/img/products/${req.params.id}/${imageName}`);

				req.body.images.push(imageName);
			})
		);
	}
	next();
});

//info image will be in property 'file' of request, file is the name of the uploaded file
exports.resizeImage = catchAsync(async (req, res, next) => {
	if (!req.file) {
		console.log('file upload avatar not exists');
		return next();
	}
	req.file.filename = `user-${req.user._id}.png`;
	await sharp(req.file.buffer)
		.resize(128, 128)
		.toFormat('png')
		.png({ quality: 90 })
		.toFile(`src/public/img/users/${req.file.filename}`);
	next();
});

//delete file img (eg. when delete product)
exports.deleteFileImg = catchAsync(async (req, res, next) => {
	var pathSaveProductImg = `src/public/img/products/${req.params.id}`;
	if (fs.existsSync(pathSaveProductImg)) {
		try {
			fs.rmdirSync(pathSaveProductImg, { recursive: true });
		} catch (err) {
			console.error(err);
		}
	}
	next();
});
