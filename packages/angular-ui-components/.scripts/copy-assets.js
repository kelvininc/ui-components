console.log(`-------------------------------------------------
Copying assets to library dist folder.
-------------------------------------------------`);

const crypto = require("crypto");
const fse = require("fs-extra");

const SRC_DIR = "../ui-components/src/assets";
const SYMBOLS_FILE_NAME = "svg-symbols.svg";
const SYMBOLS_FILE_PATH = `${SRC_DIR}/${SYMBOLS_FILE_NAME}`;
const ASSETS_DIR = "./dist/angular-ui-components/assets";

function getFileChecksum(path) {
	return new Promise(function (resolve, reject) {
		const hash = crypto.createHash("md5");
		const input = fse.createReadStream(path);

		input.on("error", reject);

		input.on("data", function (chunk) {
			hash.update(chunk);
		});

		input.on("close", function () {
			resolve(hash.digest("hex"));
		});
	});
}

getFileChecksum(SYMBOLS_FILE_PATH).then((hash) => {
	const [timestamp] = new Date().toISOString().split(".");
	const file = `symbols.${timestamp}.${hash}.svg`;
	const destination = `${ASSETS_DIR}/${file}`;

	fse.copySync(SYMBOLS_FILE_PATH, destination, { overwrite: true }, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`Copied ${file} in to your project's public folder.`);
			console.log(
				"You might consider using this in your `initialize` method for caching purposes."
			);
		}
	});

	fse.copySync(SRC_DIR, ASSETS_DIR, { overwrite: true }, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log("All assets copied!");
		}
	});
});
