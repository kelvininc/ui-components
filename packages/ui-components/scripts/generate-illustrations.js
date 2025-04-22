import path from 'path';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { optimize } from 'svgo';
import { camelCase, upperFirst, groupBy, map, find } from 'lodash-es';
import Handlebars from 'handlebars';
import { parse } from 'svg-parser';
import toHTML from 'hast-util-to-html';

const SVGO_CONFIG = {
	plugins: [{
		name: 'preset-default',
		params: {
			overrides: {
				removeViewBox: false
			},
		},
	}, 'removeXMLNS']
};

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
			const item = await optimize(file, SVGO_CONFIG);

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

		let htmlContent = toHTML(getRoot(parsedData), { allowDangerousHtml: true });

		const styleMatches = htmlContent.match(/style="[^"]+"/g) || [];
		for (const key in styleMatches) {
			const match = styleMatches[key];
			htmlContent = htmlContent.replace(match, getStyleObjectFromMatch(match));
		}

		return {
			key,
			tagName,
			className,
			illustration: htmlContent,
			viewBox: getViewBox(parsedData)
		};
	});

	function getStyleObjectFromMatch(match) {
		const cleanedMatch = match.split(';');
		const extractedStyles = cleanedMatch.reduce((acc, item) => {
			if (item.search(':') > 0) {
				const cleanedItem = item.replace('style=', '').replace(/"/g, '');
				const splittedItem = cleanedItem.split(':');
				const styleId = splittedItem[0];
				const styleValue = splittedItem[1];

				const objStr = `"${styleId}":"${styleValue}"`;
				const separator = acc !== '' ? ',' : '';
				return acc + separator + objStr;
			}

			return acc;
		}, '')

		return `style={{ ${extractedStyles} }}`
	}

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
