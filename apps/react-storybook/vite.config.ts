import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	assetsInclude: ["**/*.md"],
	resolve: {
		alias: [
			{
				find: "@pxtrn/storybook-addon-docs-stencil/dist/entry-preview-docs.js",
				replacement: path.resolve(
					__dirname,
					"node_modules/@pxtrn/storybook-addon-docs-stencil/dist/entry-preview-docs.js"
				)
			}
		]
	}
});
