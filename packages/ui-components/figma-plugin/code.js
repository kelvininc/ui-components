/**
 * Kelvin Design Tokens Export Plugin
 *
 * Exports Figma variables and styles to DTCG (Design Tokens Community Group) format
 * compatible with Style Dictionary and the Kelvin UI Components token structure.
 *
 * Creates separate files for each collection and each mode.
 * Also exports paint styles, text styles, and effect styles.
 */

// Show the plugin UI
figma.showUI(__html__, { width: 550, height: 650 });

/**
 * Converts RGBA color to hex string
 */
function rgbaToHex(color) {
	const toHex = (value) => {
		const hex = Math.round(value * 255).toString(16).padStart(2, '0');
		return hex;
	};

	const r = toHex(color.r);
	const g = toHex(color.g);
	const b = toHex(color.b);

	if (color.a !== undefined && color.a < 1) {
		const a = toHex(color.a);
		return `#${r}${g}${b}${a}`;
	}

	return `#${r}${g}${b}`;
}

/**
 * Gets the token type from Figma variable type
 */
function getTokenType(resolvedType) {
	const typeMapping = {
		'COLOR': 'color',
		'FLOAT': 'number', // spacing, sizing, border-width, radius values (will have px units added)
		'STRING': 'string',
		'BOOLEAN': 'boolean'
	};
	return typeMapping[resolvedType] || 'string';
}

/**
 * Resolves a variable alias to a token reference path
 */
function resolveAlias(variable, allVariables) {
	if (!variable) {
		console.warn('Cannot resolve alias: variable not found');
		return null;
	}
	// Convert variable name from "/" to "." for reference format
	const namePath = variable.name.replace(/\//g, '.');
	return `{${namePath}}`;
}

/**
 * Converts a variable value to the appropriate format
 */
function convertValue(value, resolvedType, allVariables) {
	// Handle variable aliases
	if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
		const referencedVar = allVariables.find(v => v.id === value.id);
		const resolved = resolveAlias(referencedVar, allVariables);

		// If we couldn't resolve the alias, log a warning and return a placeholder
		if (!resolved) {
			console.warn(`Failed to resolve alias with ID: ${value.id}`);
			return null;
		}

		return resolved;
	}

	// Handle color values
	if (resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
		return rgbaToHex(value);
	}

	// Handle numeric values in pixels (spacing, sizing, border-width, radius, etc.) - add px unit
	if (resolvedType === 'FLOAT' && typeof value === 'number') {
		return `${value}px`;
	}

	// Handle numeric values (font-weight) - keep as number without px unit
	if (resolvedType === 'NUMBER' && typeof value === 'number') {
		return value;
	}

	return value;
}

/**
 * Sets a nested value in an object using a dot-separated path
 */
function setNestedValue(obj, path, value) {
	const keys = path.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current)) {
			current[key] = {};
		}
		current = current[key];
	}

	current[keys[keys.length - 1]] = value;
}

/**
 * Mapping of Figma collection names to output folder paths
 * Adjust these mappings to match your Figma collection names
 */
const COLLECTION_PATH_MAPPING = {
	// Core tokens
	'Foundations/Primitives': 'core/foundations_primitives.json',
	'Foundations': 'core/foundations_primitives.json',
	'Primitives': 'core/foundations_primitives.json',
	'Typography': 'core/tipography.json',
	'Tipography': 'core/tipography.json',
	'Spacing': 'core/spacing.json',
	'Icon': 'core/icon.json',
	'Icons': 'core/icon.json',

	// Semantic tokens (with modes - will append mode name)
	'Semantic/Color': 'semantic/',
	'Semantic': 'semantic/',
	'Color': 'semantic/',
	'Colors': 'semantic/',

	// Component tokens
	'Component/Semantics': 'components/component_semantics.json',
	'Components': 'components/component_semantics.json',
	'Component Semantics': 'components/component_semantics.json'
};

/**
 * Gets the output path for a collection, optionally with mode
 */
function getOutputPath(collectionName, modeName = null) {
	// Try to find a matching path in the mapping
	let basePath = COLLECTION_PATH_MAPPING[collectionName];

	// If no exact match, try partial matches
	if (!basePath) {
		const lowerName = collectionName.toLowerCase();
		for (const [key, value] of Object.entries(COLLECTION_PATH_MAPPING)) {
			if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
				basePath = value;
				break;
			}
		}
	}

	// If still no match, generate a default path
	if (!basePath) {
		const safeName = collectionName.toLowerCase().replace(/[\/\s]+/g, '_').replace(/[^a-z0-9_]/g, '');
		basePath = `other/${safeName}.json`;
	}

	// If the path ends with /, it's a folder for mode-based files
	if (basePath.endsWith('/') && modeName) {
		const modeSlug = modeName.toLowerCase().replace(/[\/\s]+/g, '_').replace(/[^a-z0-9_]/g, '');
		return `${basePath}${modeSlug}.json`;
	}

	// If has mode but path doesn't end with /, append mode to filename
	if (modeName && !basePath.endsWith('/')) {
		const modeSlug = modeName.toLowerCase().replace(/[\/\s]+/g, '_').replace(/[^a-z0-9_]/g, '');
		return basePath.replace('.json', `-${modeSlug}.json`);
	}

	return basePath;
}

/**
 * Generates a safe filename from collection and mode names (legacy, for display)
 */
function generateFileName(collectionName, modeName = null) {
	const baseName = collectionName.toLowerCase().replace(/[\/\s]+/g, '-').replace(/[^a-z0-9-]/g, '');
	if (modeName) {
		const modeSlug = modeName.toLowerCase().replace(/[\/\s]+/g, '-').replace(/[^a-z0-9-]/g, '');
		return `${baseName}-${modeSlug}.json`;
	}
	return `${baseName}.json`;
}

/**
 * Processes a collection for a specific mode and returns tokens in DTCG format
 */
async function processCollectionMode(collection, mode, allVariables) {
	const result = {};
	const prefix = collection.name.toLowerCase().replace(/[\/\s]/g, '_');
	const issues = [];

	// Get variables for this collection
	const collectionVariables = allVariables.filter(
		v => v.variableCollectionId === collection.id
	);

	for (const variable of collectionVariables) {
		const tokenPath = variable.name.replace(/\//g, '.');
		const tokenType = getTokenType(variable.resolvedType);
		const modeValue = variable.valuesByMode[mode.modeId];

		if (modeValue !== undefined) {
			//Exception for weight tokens - keep as number without px unit
			const isWeightPath = tokenPath.toLowerCase().includes('weight');
			const convertedValue = convertValue(modeValue, isWeightPath ? 'NUMBER' : variable.resolvedType, allVariables);

			// Track unresolved aliases
			if (!convertedValue) {
				issues.push({
					path: tokenPath,
					issue: 'Unresolved alias',
					value: convertedValue
				});
			}

			const token = {
				value: convertedValue,
				type: tokenType,
				prefix: prefix
			};
			setNestedValue(result, tokenPath, token);
		}
	}

	// Log issues if any
	if (issues.length > 0) {
		console.warn(`Found ${issues.length} issues in ${collection.name} (${mode.name}):`, issues);
	}

	return result;
}

/**
 * Converts a paint (color/gradient) to DTCG format
 */
function convertPaint(paint) {
	if (paint.type === 'SOLID') {
		return rgbaToHex(paint.color);
	}

	if (paint.type === 'GRADIENT_LINEAR' || paint.type === 'GRADIENT_RADIAL' || paint.type === 'GRADIENT_ANGULAR' || paint.type === 'GRADIENT_DIAMOND') {
		// For gradients, return a CSS gradient string
		const stops = paint.gradientStops.map(stop => {
			const color = rgbaToHex(stop.color);
			const position = Math.round(stop.position * 100);
			return `${color} ${position}%`;
		}).join(', ');

		return `${paint.type.toLowerCase().replace('_', '-')}(${stops})`;
	}

	return null;
}

/**
 * Exports paint styles (colors) to DTCG format
 */
async function exportPaintStyles() {
	const styles = await figma.getLocalPaintStylesAsync();
	const result = {};

	for (const style of styles) {
		const path = style.name.replace(/\//g, '.');
		const paints = style.paints;

		if (paints.length > 0) {
			const value = convertPaint(paints[0]);
			if (value) {
				setNestedValue(result, path, {
					value: value,
					type: 'color',
					prefix: 'styles_paint'
				});
			}
		}
	}

	return result;
}

/**
 * Maps font style names to numeric weight values
 */
const FONT_WEIGHT_MAP = {
	'Thin': 100,
	'Hairline': 100,
	'ExtraLight': 200,
	'Extra Light': 200,
	'UltraLight': 200,
	'Ultra Light': 200,
	'Light': 300,
	'Regular': 400,
	'Normal': 400,
	'Medium': 500,
	'SemiBold': 600,
	'Semi Bold': 600,
	'DemiBold': 600,
	'Demi Bold': 600,
	'Bold': 700,
	'ExtraBold': 800,
	'Extra Bold': 800,
	'UltraBold': 800,
	'Ultra Bold': 800,
	'Black': 900,
	'Heavy': 900
};

/**
 * Exports text styles (typography) to DTCG format
 */
async function exportTextStyles(allVariables) {
	const styles = await figma.getLocalTextStylesAsync();
	const result = {};

	for (const style of styles) {
		const path = style.name.replace(/\//g, '.');
		const bound = style.boundVariables || {};
	
		// Resolve bound variables using convertValue with fallbacks to direct style values
		const fontFamily = (bound.fontFamily && convertValue(bound.fontFamily, 'STRING', allVariables)) || style.fontName.family;
		const fontWeight = (bound.fontWeight && convertValue(bound.fontWeight, 'NUMBER', allVariables)) || FONT_WEIGHT_MAP[style.fontName.style] || 400;
		const fontSize = (bound.fontSize && convertValue(bound.fontSize, 'FLOAT', allVariables)) || `${style.fontSize}px`;
		const lineHeight =
			(bound.lineHeight && convertValue(bound.lineHeight, 'FLOAT', allVariables)) ||
			(style.lineHeight.unit === 'PIXELS' ? `${style.lineHeight.value}px` : style.lineHeight.unit === 'PERCENT' ? `${style.lineHeight.value}%` : 'normal');
		const letterSpacing =
			(bound.letterSpacing && convertValue(bound.letterSpacing, 'FLOAT', allVariables)) ||
			(style.letterSpacing.unit === 'PIXELS' ? `${style.letterSpacing.value}px` : style.letterSpacing.unit === 'PERCENT' ? `${style.letterSpacing.value}%` : 'normal');

		// Create a composite typography token
		const token = {
			value: {
				fontFamily,
				fontWeight,
				fontSize,
				lineHeight,
				letterSpacing
			},
			type: 'typography',
			prefix: 'styles_text'
		};

		// Add text case if specified
		if (style.textCase && style.textCase !== 'ORIGINAL') {
			const textCaseMap = { UPPER: 'uppercase', LOWER: 'lowercase', TITLE: 'capitalize' };
			token.value.textTransform = textCaseMap[style.textCase] || style.textCase.toLowerCase();
		}

		// Add text decoration if specified
		if (style.textDecoration && style.textDecoration !== 'NONE') {
			const textDecorationMap = { UNDERLINE: 'underline', STRIKETHROUGH: 'line-through', NONE: 'none' };
			token.value.textDecoration = style.textDecoration.toLowerCase().replace('_', '-');
		}

		setNestedValue(result, path, token);
	}

	return result;
}

/**
 * Exports effect styles (shadows, blurs) to DTCG format
 */
async function exportEffectStyles() {
	const styles = await figma.getLocalEffectStylesAsync();
	const result = {};

	for (const style of styles) {
		const path = style.name.replace(/\//g, '.');
		const effects = style.effects.filter(e => e.visible !== false);

		if (effects.length > 0) {
			const effect = effects[0]; // Take the first visible effect

			if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
				const color = rgbaToHex(effect.color);
				const value = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread || 0}px ${color}`;

				setNestedValue(result, path, {
					value: value,
					type: 'shadow',
					prefix: 'styles_effect'
				});
			} else if (effect.type === 'LAYER_BLUR' || effect.type === 'BACKGROUND_BLUR') {
				setNestedValue(result, path, {
					value: `${effect.radius}px`,
					type: 'blur',
					prefix: 'styles_effect'
				});
			}
		}
	}

	return result;
}

/**
 * Main export function - creates separate exports for each collection/mode and styles
 */
async function exportVariables() {
	try {
		// Get all local variable collections
		const collections = await figma.variables.getLocalVariableCollectionsAsync();

		// Get all local variables
		const allVariables = await figma.variables.getLocalVariablesAsync();

		const exports = [];

		// Export paint styles (colors)
		const paintStyles = await exportPaintStyles();
		if (Object.keys(paintStyles).length > 0) {
			exports.push({
				id: 'styles-paint',
				collectionName: 'Paint Styles',
				modeName: null,
				fileName: 'styles-paint.json',
				filePath: 'styles/paint.json',
				variableCount: Object.keys(paintStyles).length,
				hasModes: false,
				isStyle: true,
				tokens: paintStyles
			});
		}

		// Export text styles (typography)
		const textStyles = await exportTextStyles(allVariables);
		if (Object.keys(textStyles).length > 0) {
			exports.push({
				id: 'styles-text',
				collectionName: 'Text Styles',
				modeName: null,
				fileName: 'styles-text.json',
				filePath: 'styles/text.json',
				variableCount: Object.keys(textStyles).length,
				hasModes: false,
				isStyle: true,
				tokens: textStyles
			});
		}

		// Export effect styles (shadows, blurs)
		const effectStyles = await exportEffectStyles();
		if (Object.keys(effectStyles).length > 0) {
			exports.push({
				id: 'styles-effect',
				collectionName: 'Effect Styles',
				modeName: null,
				fileName: 'styles-effect.json',
				filePath: 'styles/effect.json',
				variableCount: Object.keys(effectStyles).length,
				hasModes: false,
				isStyle: true,
				tokens: effectStyles
			});
		}

		for (const collection of collections) {
			const variableCount = allVariables.filter(v => v.variableCollectionId === collection.id).length;
			const modes = collection.modes || [];
			const hasModes = modes.length > 1;

			if (hasModes) {
				// Create separate export for each mode
				for (const mode of modes) {
					const tokens = await processCollectionMode(collection, mode, allVariables);
					const filePath = getOutputPath(collection.name, mode.name);
					exports.push({
						id: `${collection.id}-${mode.modeId}`,
						collectionName: collection.name,
						modeName: mode.name,
						fileName: generateFileName(collection.name, mode.name),
						filePath: filePath,
						variableCount,
						hasModes: true,
						tokens
					});
				}
			} else {
				// Single mode - just export as is
				const mode = modes[0];
				const tokens = await processCollectionMode(collection, mode, allVariables);
				const filePath = getOutputPath(collection.name, null);
				exports.push({
					id: collection.id,
					collectionName: collection.name,
					modeName: null,
					fileName: generateFileName(collection.name),
					filePath: filePath,
					variableCount,
					hasModes: false,
					tokens
				});
			}
		}

		return {
			exports,
			exportDate: new Date().toISOString(),
			fileName: figma.root.name,
			totalCollections: collections.length,
			totalVariables: allVariables.length
		};
	} catch (error) {
		console.error('Export error:', error);
		throw error;
	}
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
	if (msg.type === 'export') {
		try {
			const data = await exportVariables();
			figma.ui.postMessage({ type: 'export-result', data });
		} catch (error) {
			figma.ui.postMessage({ type: 'error', message: error.message });
		}
	}

	if (msg.type === 'close') {
		figma.closePlugin();
	}
};

// Initial export when plugin loads
exportVariables().then(data => {
	figma.ui.postMessage({ type: 'export-result', data });
}).catch(error => {
	figma.ui.postMessage({ type: 'error', message: error.message });
});
