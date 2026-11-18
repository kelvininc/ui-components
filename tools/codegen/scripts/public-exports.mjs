/** Determine runtime availability through public export and import chains, preserving `export type`. */
export const runtimeExport = (
	ts,
	program,
	checker,
	source,
	name,
	visiting = new Set()
) => {
	const key = `${source.fileName}:${name}`;

	if (visiting.has(key)) {
		return false;
	}
	const seen = new Set(visiting).add(key);
	/** Resolve the referenced barrel and fail when its public module is missing. */
	const moduleSource = (specifier) => {
		const resolved = ts.resolveModuleName(
			specifier.text,
			source.fileName,
			program.getCompilerOptions(),
			ts.sys
		).resolvedModule;

		if (!resolved) {
			throw new Error(
				`Unresolved public module ${source.fileName}: ${specifier.text}`
			);
		}
		const file = program.getSourceFile(resolved.resolvedFileName);

		if (!file) {
			throw new Error(
				`Module missing from compiler program: ${resolved.resolvedFileName}`
			);
		}

		return file;
	};
	/** Follow local imports while preserving type-only bindings through re-export chains. */
	const localValue = (localName) => {
		for (const statement of source.statements) {
			if (!ts.isImportDeclaration(statement) || !statement.importClause) {
				continue;
			}
			const clause = statement.importClause;
			const bindings = clause.namedBindings;

			if (clause.name?.text === localName) {
				return (
					!clause.isTypeOnly &&
					runtimeExport(
						ts,
						program,
						checker,
						moduleSource(statement.moduleSpecifier),
						'default',
						seen
					)
				);
			}

			if (
				bindings &&
				ts.isNamespaceImport(bindings) &&
				bindings.name.text === localName
			) {
				return !clause.isTypeOnly;
			}

			if (bindings && ts.isNamedImports(bindings)) {
				const item = bindings.elements.find(
					(item) => item.name.text === localName
				);

				if (item) {
					return (
						!clause.isTypeOnly &&
						!item.isTypeOnly &&
						runtimeExport(
							ts,
							program,
							checker,
							moduleSource(statement.moduleSpecifier),
							(item.propertyName || item.name).text,
							seen
						)
					);
				}
			}
		}
		const symbol = checker
			.getSymbolsInScope(
				source,
				ts.SymbolFlags.Value | ts.SymbolFlags.Alias
			)
			.find((item) => item.name === localName);
		const target =
			symbol &&
			(symbol.flags & ts.SymbolFlags.Alias
				? checker.getAliasedSymbol(symbol)
				: symbol);

		return !!(target?.flags & ts.SymbolFlags.Value);
	};

	// Only emitted value exports can override runtime star exports.
	for (const statement of source.statements) {
		if (!ts.isExportDeclaration(statement) || !statement.exportClause) {
			continue;
		}

		if (
			ts.isNamespaceExport(statement.exportClause) &&
			statement.exportClause.name.text === name
		) {
			return !statement.isTypeOnly;
		}

		if (ts.isNamedExports(statement.exportClause)) {
			const item = statement.exportClause.elements.find(
				(item) => item.name.text === name
			);

			if (item) {
				if (statement.isTypeOnly || item.isTypeOnly) {
					continue;
				}
				const original = (item.propertyName || item.name).text;

				const emitted = statement.moduleSpecifier
					? runtimeExport(
						ts,
						program,
						checker,
						moduleSource(statement.moduleSpecifier),
						original,
						seen
					)
					: localValue(original);

				if (emitted) {
					return true;
				}
			}
		}
	}
	const module = checker.getSymbolAtLocation(source);
	const symbol =
		module &&
		checker.getExportsOfModule(module).find((item) => item.name === name);

	if (!symbol) {
		return false;
	}

	if (
		symbol.declarations?.some(
			(declaration) =>
				declaration.getSourceFile() === source &&
				!ts.isExportSpecifier(declaration)
		)
	) {
		const target =
			symbol.flags & ts.SymbolFlags.Alias
				? checker.getAliasedSymbol(symbol)
				: symbol;

		return !!(target.flags & ts.SymbolFlags.Value);
	}

	for (const statement of source.statements) {
		if (
			ts.isExportDeclaration(statement) &&
			!statement.exportClause &&
			!statement.isTypeOnly &&
			statement.moduleSpecifier &&
			runtimeExport(
				ts,
				program,
				checker,
				moduleSource(statement.moduleSpecifier),
				name,
				seen
			)
		) {
			return true;
		}
	}

	return false;
};
