import ts from 'typescript';

/**
 * Canonicalize property-only object types emitted by Stencil across different hosts.
 * Preserve overload, tuple and union order because those can affect TypeScript behavior.
 * @param {string} text - Complete TypeScript type expression from compiler metadata.
 * @returns {string} A printed type with unique property signatures sorted by name.
 */
export const canonicalType = (text) => {
	const source = ts.createSourceFile(
		'catalog.ts',
		`type Catalog = ${text};`,
		ts.ScriptTarget.Latest,
		true
	);

	if (source.parseDiagnostics.length) {
		return text;
	}

	const result = ts.transform(source.statements[0].type, [
		(context) => {
			/** Sort only uniquely named property signatures; retain every other declaration order. */
			const visit = (node) => {
				const visited = ts.visitEachChild(node, visit, context);

				if (
					!ts.isTypeLiteralNode(visited) ||
					!visited.members.every(
						(member) =>
							ts.isPropertySignature(member) &&
							(ts.isIdentifier(member.name) ||
								ts.isStringLiteral(member.name) ||
								ts.isNumericLiteral(member.name))
					)
				) {
					return visited;
				}

				const names = visited.members.map((member) => member.name.text);

				if (new Set(names).size !== names.length) {
					return visited;
				}

				return ts.factory.updateTypeLiteralNode(
					visited,
					[...visited.members].sort((a, b) =>
						a.name.text < b.name.text
							? -1
							: a.name.text > b.name.text
								? 1
								: 0
					)
				);
			};

			return visit;
		}
	]);

	try {
		return ts
			.createPrinter({ newLine: ts.NewLineKind.LineFeed })
			.printNode(ts.EmitHint.Unspecified, result.transformed[0], source);
	} finally {
		result.dispose();
	}
};
