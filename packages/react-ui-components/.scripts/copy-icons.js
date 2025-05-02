console.log(`-------------------------------------------------
Copying icons to public folder.
-------------------------------------------------`);

import crypto from 'crypto';
import fse from 'fs-extra';
import path from 'path';

const SYMBOLS_FILE_NAME = 'svg-symbols.svg';
const PWD_REACT_LIB = '/node_modules/@kelvininc/react-ui-components/';

let assetsDirPath = './dist/assets';
let publicDirPath = '../../../public';

if (process.env.CUSTOM_INST === 'true') {
	publicDirPath = path.join(process.env.PWD, '/public');
	assetsDirPath = path.join(process.env.PWD, PWD_REACT_LIB, assetsDirPath);
}

const symbolFilePath = path.resolve(assetsDirPath, SYMBOLS_FILE_NAME);

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

getFileChecksum(symbolFilePath)
	.then(hash => {
		const file = `symbols.${hash}.svg`;

		fse.copy(symbolFilePath, `${publicDirPath}/${file}`, { overwrite: true }, err => {
			if (err) {
				console.error(err);
			} else {
				console.log(`| Copied ${file} in to your project's public folder.`);
				console.log('| You might consider using this for caching purposes.');
			}
		});

		fse.copy(symbolFilePath, `${publicDirPath}/${SYMBOLS_FILE_NAME}`, { overwrite: true }, err => {
			if (err) {
				console.error(err);
			} else {
				console.log(`| Copied ${SYMBOLS_FILE_NAME} in to your project's public folder.`);
			}
		});
	})
	.catch(() => console.log('| ! svg-symbols file not found'));
