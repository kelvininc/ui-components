console.log(`-------------------------------------------------
Copying assets to library dist folder.
-------------------------------------------------`);

const fse = require("fs-extra");

const srcDir = "../ui-components/src/assets";
const destDir = "./dist/angular-ui-components/assets";

fse.copySync(srcDir, destDir, { overwrite: true }, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log("All assets copied!");
	}
});
