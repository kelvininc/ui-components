const path = require('path');
const fg = require('fast-glob');
const fs = require('fs-extra');
const SVGO = require('svgo');
const { camelCase, upperFirst, groupBy, map, find } = require('lodash');
const Handlebars = require('handlebars');

const { parse } = require('svg-parser');
const toHTML = require('hast-util-to-html');

const SVGO_CONFIG = {
	plugins: [{ removeViewBox: false }, { removeXMLNS: true }]
};

const svgo = new SVGO(SVGO_CONFIG);

const INPUT_GLOB = './src/illustrations/**/*.svg';
const OUTPUT_PATH = './src/components/illustrations';
const ILLUSTRATION_TEMPLATE_PATH = './src/illustrations/illustration-component.hbs';
const EXT = '.svg';

main();

async function main() {
	/* Get SVG data from source files */
	const entries = await fg(INPUT_GLOB);

	/* Read file, optimized svg, extract "state" (default) */
	const files = await Promise.all(
		entries.map(async filepath => {
			const file = await fs.readFile(filepath, { encoding: 'utf-8' });
			const item = await svgo.optimize(file);

			const state = path.basename(filepath, EXT);
			const cleanPath = path.dirname(filepath).replace(INPUT_GLOB.replace('**/*.svg', ''), '');
			const pathParts = cleanPath.split('/');
			const key = 'kv-' + cleanPath.replace(/\//gi, '-');
			const category = pathParts[0];
			const name = 'kv-' + pathParts[pathParts.length - 1];

			return {
				...item,
				filepath,
				key,
				category,
				name,
				state
			};
		})
	);

	/* Parse, define names and markup */

	const groupedByState = groupBy(files, 'key');

	const components = map(groupedByState, (item, key) => {
		const defaultItem = find(item);
		const tagName = key;
		const className = upperFirst(camelCase(key));
		const parsedData = parse(defaultItem.data);

		return {
			key,
			tagName,
			className,
			illustration: toHTML(getRoot(parsedData)),
			viewBox: getViewBox(parsedData)
		};
	});

	function getViewBox(tree) {
		return tree.children[0].properties.viewBox || '0 0 24 24';
	}

	function getRoot(tree) {
		// skip <svg> root
		const { children } = tree.children[0];

		return {
			type: 'root',
			children: children
		};
	}

	/* Get component templates */
	const rawIllustrationTemplate = fs.readFileSync(ILLUSTRATION_TEMPLATE_PATH, {
		encoding: 'utf-8'
	});
	const illustrationTemplate = Handlebars.compile(rawIllustrationTemplate);

	try {
		await fs.emptyDir(OUTPUT_PATH);
		// Create dir for each component, render template into new file
		await Promise.all(
			components.map(async component => {
				const dir = path.join(OUTPUT_PATH, component.key);
				await fs.mkdirp(dir);
				return fs.writeFile(path.join(dir, component.key + '.tsx'), illustrationTemplate(component));
			})
		);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}
