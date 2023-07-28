console.log(`-------------------------------------------------
Copying icons to public folder.
-------------------------------------------------`);

const crypto = require('crypto');
const fse = require('fs-extra');

const SRC_DIR = './assets';
const SYMBOLS_FILE_NAME = 'svg-symbols.svg';
const SYMBOLS_FILE_PATH = `${SRC_DIR}/${SYMBOLS_FILE_NAME}`;
const PUBLIC_DIR = '../../../public';

function getFileChecksum(path) {
	return new Promise(function (resolve, reject) {
		const hash = crypto.createHash('md5');
		const input = fse.createReadStream(path);

		input.on('error', reject);

		input.on('data', function (chunk) {
			hash.update(chunk);
		});

		input.on('close', function () {
			resolve(hash.digest('hex'));
		});
	});
}

getFileChecksum(SYMBOLS_FILE_PATH)
	.then(hash => {
		const file = `symbols.${hash}.svg`;
		const destination = `${PUBLIC_DIR}/${file}`;

		fse.copySync(SYMBOLS_FILE_PATH, destination, { overwrite: true }, err => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Copied ${file} in to your project's public folder.`);
				console.log('You might consider using this for caching purposes.');
			}
		});

		fse.copySync(SYMBOLS_FILE_PATH, `${PUBLIC_DIR}/${SYMBOLS_FILE_NAME}`, { overwrite: true }, err => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Copied ${file} in to your project's public folder.`);
			}
		});
	})
	.catch(() => console.log('| ! svg-symbols file not found'))
	.finally(() => console.log(`-------------------------------------------------`));
