import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the target file path
const targetFilePath = path.resolve(__dirname, '../../react-ui-components/src/stencil-generated/index.ts');

// Define content to prepend
const contentToPrepend = `
'use client';
`;

// Prepend content to the file
try {
	// Check if file exists
	if (fs.existsSync(targetFilePath)) {
		const existingContent = fs.readFileSync(targetFilePath, 'utf8');
		const newContent = contentToPrepend + existingContent;
		fs.writeFileSync(targetFilePath, newContent);
		console.log(`Successfully prepended content to ${targetFilePath}`);
	} else {
		console.error(`Error: Target file doesn't exist at ${targetFilePath}`);
		process.exit(1);
	}
} catch (error) {
	console.error(`Error prepending to file: ${error.message}`);
	process.exit(1);
}
