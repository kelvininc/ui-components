/** APIs absent from React 18, grouped by the module that exports them. */
const unsupported = {
	react: new Set([
		'use',
		'useActionState',
		'useOptimistic',
		'useEffectEvent',
		'Activity',
		'ViewTransition',
		'addTransitionType',
		'cache',
		'cacheSignal',
		'captureOwnerStack'
	]),
	'react-dom': new Set([
		'useFormStatus',
		'useFormState',
		'requestFormReset',
		'preconnect',
		'prefetchDNS',
		'preinit',
		'preinitModule',
		'preload',
		'preloadModule'
	])
};

module.exports = {
	meta: {
		type: 'problem',
		schema: [],
		messages: {
			unavailable:
				'{{name}} from {{module}} is unavailable in the supported React 18 runtime. Check the React 18 documentation through Context7.'
		}
	},
	/** Resolve imported bindings so aliases are checked without flagging a shadowed local object. */
	create(context) {
		/** Report only statically resolved APIs absent from the supported runtime. */
		const report = (node, module, name) => {
			if (unsupported[module]?.has(name)) {
				context.report({
					node,
					messageId: 'unavailable',
					data: { module, name }
				});
			}
		};

		/** Resolve an imported namespace without mistaking a shadowed local binding for React. */
		const checkImport = (node, object, name) => {
			if (
				!['Identifier', 'JSXIdentifier'].includes(object?.type) ||
				typeof name !== 'string'
			) {
				return;
			}

			const source = context.sourceCode ?? context.getSourceCode();
			let scope = source.getScope
				? source.getScope(node)
				: context.getScope();

			while (scope) {
				const binding = scope.set.get(object.name);

				if (binding) {
					const imported = binding.defs.find(
						(def) => def.type === 'ImportBinding'
					);

					if (
						imported &&
						[
							'ImportNamespaceSpecifier',
							'ImportDefaultSpecifier'
						].includes(imported.node.type)
					) {
						report(node, imported.parent.source.value, name);
					}

					return;
				}

				scope = scope.upper;
			}
		};

		/** Check static destructured keys while leaving dynamic keys and rest bindings unresolved. */
		const checkPattern = (pattern, value) => {
			if (pattern?.type !== 'ObjectPattern') {
				return;
			}

			for (const property of pattern.properties) {
				if (property.type !== 'Property') {
					continue;
				}

				const name = property.computed
					? property.key.value
					: property.key.name ?? property.key.value;

				checkImport(property, value, name);
			}
		};

		return {
			/** Reject unsupported named imports, including aliases. */
			ImportDeclaration(node) {
				for (const item of node.specifiers) {
					if (item.type === 'ImportSpecifier') {
						report(
							item,
							node.source.value,
							item.imported.name ?? item.imported.value
						);
					}
				}
			},
			/** Prevent forwarding unsupported APIs through a public barrel. */
			ExportNamedDeclaration(node) {
				if (!node.source) {
					return;
				}

				for (const item of node.specifiers) {
					report(
						item,
						node.source.value,
						item.local.name ?? item.local.value
					);
				}
			},
			/** Resolve namespace bindings before checking static JavaScript or JSX member access. */
			'MemberExpression, JSXMemberExpression'(node) {
				checkImport(
					node,
					node.object,
					node.computed ? node.property.value : node.property.name
				);
			},
			/** Check aliases extracted from a namespace in a declaration. */
			VariableDeclarator(node) {
				checkPattern(node.id, node.init);
			},
			/** Check aliases extracted from a namespace by a later assignment. */
			AssignmentExpression(node) {
				checkPattern(node.left, node.right);
			}
		};
	}
};
