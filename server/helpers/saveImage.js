import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import Jimp from 'jimp';

import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

conn.once('open', () => {
	gfs = Grid(conn.db);
});

export function genFileName({ mimetype }) {
	let extension = mimetype.split('/')[1];
	let possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
		imgName = '';

	for (let i = 0; i < 8; i++) {
		imgName += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return imgName + '.' + extension;
}

export function saveImage(file, filename) {
	filename = filename || genFileName(file);

	return new Promise((resolve) => {
		Jimp.read(file.data).then(function (image) {
			const aspectRatio = image.bitmap.width / image.bitmap.height;
			const width = 600;

			if (image.bitmap.width > 800) {
				image.resize(width, Jimp.AUTO)
					.getBuffer(file.mimetype, function(err, buffer){
						const height = Math.round(width / aspectRatio);
						minifyAndSave(buffer, filename, file.mimetype, resolve, width, height);
					});
			} else {
				minifyAndSave(file.data, filename, file.mimetype, resolve);
			}
		}).catch(function (err) {
			throw err;
		});
	});
}


export function createPreview(file, filename) {
	return new Promise((resolve) => {
		Jimp.read(file.data).then(function (image) {
			const aspectRatio = image.bitmap.width / image.bitmap.height;

			image.resize(30, Jimp.AUTO, function(err) {
				this.getBase64(file.mimetype, (err, base64) => {
					resolve(base64);
				});
			})
		}).catch(function (err) {
			throw err;
		});
	});
}

export function saveAvatar(file, filename) {
	filename = filename || genFileName(file);

	return new Promise((resolve) => {
		Jimp.read(file.data)
		.then(function (image) {
			if (image.bitmap.width > 200) {
				image//.crop(100, 100, 600, 600)
				.resize(200, Jimp.AUTO)
					.getBuffer(file.mimetype, function (err, buffer) {
						minifyAndSave(buffer, filename, file.mimetype, resolve, image.bitmap.width, image.bitmap.height);
					});
			} else {
				minifyAndSave(file.data, filename, file.mimetype, resolve);
			}
		}).catch(function (err) {
			throw err;
		});
	});
}

function minifyAndSave(buffer, filename, mimetype, resolve, width, height) {
	imagemin.buffer(buffer, {
		plugins: [
			imageminJpegtran(),
			imageminPngquant({ quality: '65-80' })
		]
	}).then((fileBuffer) => {
		let writestream = gfs.createWriteStream({
			filename: filename,
			mode: 'w',
			content_type: mimetype
		});

		writestream.on('close', function (file) {
			resolve({filename, width, height});
		});

		writestream.write(fileBuffer);
		writestream.end();
	});
}

export function updateImage(file, filename, oldFilename) {
	deleteImage(oldFilename);
	return saveImage(file, filename);
}

export function deleteImage(filename) {
	return new Promise((resolve) => {
		gfs.remove({filename}, function (err) {
			if (err) {
				throw err;
			}
			resolve();
		});
	});
}
