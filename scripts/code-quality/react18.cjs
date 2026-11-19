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
	/**
	 * Resolve every static binding of the react or react-dom module object, so aliases are checked
	 * without flagging a shadowed local object. A binding resolves through default, namespace and
	 * `{ default as R }` imports, `require()` and awaited `import()` initializers, `.default`
	 * members, type assertions, optional chains and never-reassigned aliases. Parameters, other call
	 * results and reassigned variables stay unresolved.
	 */
	create(context) {
		const source = context.sourceCode ?? context.getSourceCode();

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

		/** Read a static key or import name; computed keys count only as string literals. */
		const staticName = (key, computed = false) => {
			const name = computed ? key.value : key.name ?? key.value;

			return typeof name === 'string' ? name : undefined;
		};

		/** Find the variable an identifier refers to, from the innermost scope outward. */
		const findVariable = (identifier) => {
			let scope = source.getScope
				? source.getScope(identifier)
				: context.getScope();

			while (scope) {
				const variable = scope.set.get(identifier.name);

				if (variable) {
					return variable;
				}

				scope = scope.upper;
			}

			return undefined;
		};

		/** Whether a declared name receives the whole initializer, directly or through `default` keys. */
		const bindsWhole = (pattern, target) => {
			if (pattern === target) {
				return true;
			}

			if (pattern?.type === 'AssignmentPattern') {
				return bindsWhole(pattern.left, target);
			}

			return (
				pattern?.type === 'ObjectPattern' &&
				pattern.properties.some(
					(property) =>
						property.type === 'Property' &&
						staticName(property.key, property.computed) === 'default' &&
						bindsWhole(property.value, target)
				)
			);
		};

		/** Name the module a string literal specifier refers to. */
		const specifier = (node) =>
			node?.type === 'Literal' && typeof node.value === 'string'
				? node.value
				: undefined;

		/** Look through TypeScript assertions and optional chains, which leave the runtime value unchanged. */
		const unwrap = (node) =>
			[
				'ChainExpression',
				'TSAsExpression',
				'TSNonNullExpression',
				'TSSatisfiesExpression',
				'TSTypeAssertion'
			].includes(node?.type)
				? unwrap(node.expression)
				: node;

		/**
		 * Name the module whose object an expression statically denotes; `seen` stops alias cycles.
		 * @returns {string | undefined} The module specifier, or undefined when it is not statically known.
		 */
		const moduleOf = (expression, seen = new Set()) => {
			const node = unwrap(expression);

			if (!node || seen.has(node)) {
				return undefined;
			}

			seen.add(node);

			switch (node.type) {
				case 'Identifier':
				case 'JSXIdentifier':
					return bindingModule(node, seen);
				case 'MemberExpression':
				case 'JSXMemberExpression':
					return staticName(node.property, node.computed) === 'default'
						? moduleOf(node.object, seen)
						: undefined;
				case 'AwaitExpression': {
					const argument = unwrap(node.argument);

					return argument?.type === 'ImportExpression'
						? specifier(argument.source)
						: undefined;
				}
				case 'CallExpression':
					return node.callee.type === 'Identifier' &&
						node.callee.name === 'require' &&
						!findVariable(node.callee)?.defs.length
						? specifier(node.arguments[0])
						: undefined;
				default:
					return undefined;
			}
		};

		/** Resolve an import or a never-reassigned alias without mistaking a shadowed local binding for React. */
		const bindingModule = (identifier, seen) => {
			const variable = findVariable(identifier);
			// A type-only declaration merged with the binding leaves its runtime value unchanged.
			const values =
				variable?.defs.filter((definition) => definition.type !== 'Type') ??
				[];

			if (values.length !== 1) {
				return undefined;
			}

			const [definition] = values;
			const { node } = definition;

			if (definition.type === 'ImportBinding') {
				const whole =
					node.type === 'ImportNamespaceSpecifier' ||
					node.type === 'ImportDefaultSpecifier' ||
					(node.type === 'ImportSpecifier' &&
						staticName(node.imported) === 'default');

				return whole ? definition.parent.source.value : undefined;
			}

			const reassigned = variable.references.some(
				(reference) => reference.isWrite() && !reference.init
			);

			return definition.type === 'Variable' &&
				!reassigned &&
				bindsWhole(node.id, definition.name)
				? moduleOf(node.init, seen)
				: undefined;
		};

		/** Check static destructured keys, following `default` keys and leaving dynamic keys and rest bindings unresolved. */
		const checkPattern = (pattern, module) => {
			if (!module || pattern?.type !== 'ObjectPattern') {
				return;
			}

			for (const property of pattern.properties) {
				if (property.type !== 'Property') {
					continue;
				}

				const name = staticName(property.key, property.computed);

				if (name === 'default') {
					checkPattern(
						property.value.type === 'AssignmentPattern'
							? property.value.left
							: property.value,
						module
					);
				} else {
					report(property, module, name);
				}
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
			/** Check static JavaScript or JSX member access on a resolved module object. */
			'MemberExpression, JSXMemberExpression'(node) {
				const module = moduleOf(node.object);

				if (module) {
					report(node, module, staticName(node.property, node.computed));
				}
			},
			/** Check names extracted from a module object in a declaration. */
			VariableDeclarator(node) {
				checkPattern(node.id, moduleOf(node.init));
			},
			/** Check names extracted from a module object by a later assignment. */
			AssignmentExpression(node) {
				checkPattern(node.left, moduleOf(node.right));
			}
		};
	}
};
