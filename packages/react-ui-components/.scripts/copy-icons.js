console.log(`-------------------------------------------------
Copying icons to public folder.
-------------------------------------------------`);

const fse = require("fs-extra");

const srcDir = "./assets/svg-symbols.svg";
const destDir = "../../../public/svg-symbols.svg";

fse.copySync(srcDir, destDir, { overwrite: true }, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log("All icons copied!");
	}
});
