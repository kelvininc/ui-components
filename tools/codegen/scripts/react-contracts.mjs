import { existsSync } from 'node:fs';
import path from 'node:path';

/** Remove installation prefixes from TypeScript's external module type queries. */
const portableType = (label) =>
	label.replace(/import\("([^"]+)"\)/g, (match, module) => {
		const normalized = module.replaceAll('\\', '/');
		const marker = '/node_modules/';

		if (normalized.includes(marker)) {
			return `import("${normalized.slice(
				normalized.lastIndexOf(marker) + marker.length
			)}")`;
		}

		if (path.isAbsolute(module)) {
			throw new Error(`Non-portable component type: ${label}`);
		}

		return match;
	});

/** Read defaults explicitly declared on the component's parameter or public prop JSDoc. */
const parameterDefaults = (ts, declaration) => {
	const defaults = new Map();
	/** Read destructured component parameter defaults without descending into nested functions. */
	const visit = (node) => {
		if (ts.isFunctionLike(node)) {
			const parameter = node.parameters?.[0];

			if (parameter && ts.isObjectBindingPattern(parameter.name)) {
				for (const element of parameter.name.elements) {
					if (element.initializer) {
						defaults.set(
							(element.propertyName || element.name).getText(),
							element.initializer.getText()
						);
					}
				}
			}

			return;
		}

		ts.forEachChild(node, visit);
	};

	visit(declaration);

	return defaults;
};

/** Extract public, React-authored callable components; exclude generated bindings and helpers. */
export const componentContract = (ts, checker, symbol, name, reactRoot) => {
	const declaration = symbol.valueDeclaration || symbol.declarations?.[0];

	if (!declaration || !/^[A-Z]/.test(name)) {
		return undefined;
	}

	const filename = declaration.getSourceFile().fileName;
	const relative = path
		.relative(reactRoot, filename)
		.split(path.sep)
		.join('/');

	if (!relative.startsWith('src/components/') || !relative.endsWith('.tsx')) {
		return undefined;
	}

	const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
	const signatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
	const signature = signatures.find((item) =>
		/(?:Element|ReactNode|ReactPortal)/.test(
			checker.typeToString(item.getReturnType())
		)
	);

	if (!signature) {
		return undefined;
	}

	const parameter = signature.parameters[0];
	const propsType =
		parameter && checker.getTypeOfSymbolAtLocation(parameter, declaration);
	const defaults = parameterDefaults(ts, declaration);
	/** Read each prop type, callback signature and documented default from its declaration. */
	const describe = (property) => {
		const location =
			property.valueDeclaration ||
			property.declarations?.[0] ||
			declaration;
		const propType = checker.getTypeOfSymbolAtLocation(property, location);
		const callSignatures = checker
			.getSignaturesOfType(
				checker.getNonNullableType(propType),
				ts.SignatureKind.Call
			)
			.map((signature) =>
				portableType(
					checker.signatureToString(
						signature,
						undefined,
						ts.TypeFormatFlags.NoTruncation
					)
				)
			);
		const docDefault = property
			.getJsDocTags(checker)
			.find((tag) => ['default', 'defaultValue'].includes(tag.name));

		return {
			name: property.name,
			type: portableType(
				checker.typeToString(
					propType,
					undefined,
					ts.TypeFormatFlags.NoTruncation
				)
			),
			...(callSignatures.length ? { callSignatures } : {}),
			required: !(property.flags & ts.SymbolFlags.Optional),
			description: ts.displayPartsToString(
				property.getDocumentationComment(checker)
			),
			default:
				defaults.get(property.name) ??
				(docDefault ? ts.displayPartsToString(docDefault.text) : null)
		};
	};
	const allProps = propsType ? checker.getPropertiesOfType(propsType) : [];
	const ownProps = allProps.filter((property) =>
		property.declarations?.some(
			(item) => !item.getSourceFile().fileName.includes('/@types/react/')
		)
	);
	let refHandle;
	/** Find forwardRef handles in the authored component without inventing an imperative API. */
	const visit = (node) => {
		if (
			ts.isCallExpression(node) &&
			/(?:^|\.)forwardRef$/.test(node.expression.getText())
		) {
			const callbackRef = node.arguments[0]?.parameters?.[1]?.type;
			const handleNode =
				node.typeArguments?.[0] || callbackRef?.typeArguments?.[0];

			if (handleNode) {
				const handle = checker.getTypeFromTypeNode(handleNode);

				refHandle = {
					type: portableType(checker.typeToString(handle)),
					members: checker
						.getPropertiesOfType(handle)
						.map(describe)
				};
			}
		}

		ts.forEachChild(node, visit);
	};

	visit(declaration);

	const readme = ['readme.md', 'README.md']
		.map((file) => path.join(path.dirname(filename), file))
		.find(existsSync);

	return {
		source: relative,
		description: ts.displayPartsToString(
			symbol.getDocumentationComment(checker)
		),
		signature: portableType(
			checker.signatureToString(
				signature,
				undefined,
				ts.TypeFormatFlags.NoTruncation
			)
		),
		props: ownProps
			.map(describe)
			.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)),
		inheritedPlatformProps: allProps.length - ownProps.length,
		...(refHandle ? { refHandle } : {}),
		...(readme
			? {
				readme: path
					.relative(reactRoot, readme)
					.split(path.sep)
					.join('/')
			}
			: {})
	};
};

/** Encode prose code spans without table escaping or truncating embedded backticks. */
const codeSpan = (value) => {
	const text = String(value).replaceAll('\n', ' ');
	const longest = Math.max(
		0,
		...Array.from(text.matchAll(/`+/g), ([run]) => run.length)
	);
	const fence = '`'.repeat(longest + 1);

	return `${fence} ${text} ${fence}`;
};

/** Render the same native contracts stored in the React manifest, without invented defaults. */
export const renderContracts = (packageName, components, cell, sourceBase) => {
	// Escape type syntax so Markdown keeps generic arguments and intersections visible.
	/** Preserve generic and intersection syntax inside a Markdown table cell. */
	const typeCell = (value) =>
		cell(value)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;');
	/** Render the manifest prop contracts without adding inferred or undocumented defaults. */
	const rows = (props) =>
		props
			.map(
				(prop) =>
					`| ${prop.name} | ${
						prop.required ? 'yes' : 'no'
					} | ${typeCell(prop.type)} | ${typeCell(
						(prop.callSignatures || []).join('; ')
					)} | ${cell(prop.default ?? 'not declared')} | ${cell(
						prop.description
					)} |`
			)
			.join('\n');

	return (
		'\n## React-authored component contracts\n\nDefaults below come from source initializers or @default tags. Descriptive defaults also remain in the source comments. Inherited platform props are available in the installed declarations. Source and usage links refer to the repository dev branch; use the installed declarations for the shipped version.\n\n' +
		Object.entries(components)
			.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
			.map(
				([name, item]) =>
					`### ${name}\n\nImport: ${item.entries
						.map(
							(entry) =>
								`\`${packageName}${
									entry === '.' ? '' : entry.slice(1)
								}\``
						)
						.join(', ')}. [Source](${
						new URL(item.source, sourceBase).href
					})${
						item.readme
							? ` · [Usage](${
								new URL(item.readme, sourceBase).href
							})`
							: ''
					}.\n\n${item.description}\n\n` +
					`Signature: ${codeSpan(
						item.signature
					)}.\n\n| Prop | Required | Type | Call signatures | Declared default | Description |\n| --- | --- | --- | --- | --- | --- |\n${rows(
						item.props
					)}\n` +
					(item.refHandle
						? `\nRef handle: ${codeSpan(
							item.refHandle.type
						)}.\n\nMembers declared by dependencies are documented in their installed TypeScript declarations.\n` +
							(item.refHandle.members.length
								? `\n| Member | Required | Type | Call signatures | Declared default | Description |\n| --- | --- | --- | --- | --- | --- |\n${rows(
									item.refHandle.members
								)}\n`
								: '')
						: '')
			)
			.join('\n')
	);
};
