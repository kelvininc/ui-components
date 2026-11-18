import assert from 'node:assert/strict';
import {
	mkdirSync,
	mkdtempSync,
	rmSync,
	symlinkSync,
	writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { componentContract, renderContracts } from './react-contracts.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const repository = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../..'
);

test('should expose controlled props, callbacks, defaults and imperative ref members', () => {
	const root = mkdtempSync(path.join(tmpdir(), 'react-contract-'));

	try {
		mkdirSync(path.join(root, 'src/components'), { recursive: true });
		symlinkSync(
			path.join(repository, 'packages/react-ui-components/node_modules'),
			path.join(root, 'node_modules')
		);
		const filename = path.join(root, 'src/components/Editor.tsx');

		writeFileSync(
			filename,
			`import React, { forwardRef } from 'react';
            import type { editor } from 'monaco-editor';
            type OnChange = (value: string | undefined) => void;
            type Props = {
                /** Current parent-owned value. */
                value: string;
                onChange: OnChange;
                delay?: number;
                /** @default "yaml" */
                language?: string;
                instance?: typeof import('react');
            };
            type Handle = { focus: () => void; ready: Promise<boolean> };
            export const Editor = forwardRef<Handle, Props>(function Editor({ value, delay = 10 }, ref) { return null; });
            export const ExternalEditor = forwardRef<editor.IStandaloneCodeEditor, Props>((props, ref) => null);
            export const Factory = () => 42;
            export const Plain = ({ enabled = true }: { enabled?: boolean }) => React.createElement('div');
        `
		);
		const program = ts.createProgram([filename], {
			jsx: ts.JsxEmit.ReactJSX,
			moduleResolution: ts.ModuleResolutionKind.Bundler,
			module: ts.ModuleKind.ESNext,
			strict: true
		});
		const checker = program.getTypeChecker();
		const source = program.getSourceFile(filename);
		const symbols = checker.getExportsOfModule(
			checker.getSymbolAtLocation(source)
		);
		/** Read one fixture export through the production React contract extractor. */
		const contract = (name) =>
			componentContract(
				ts,
				checker,
				symbols.find((symbol) => symbol.name === name),
				name,
				root
			);
		const editor = contract('Editor');

		assert.ok(
			contract('ExternalEditor').refHandle.members.some(
				(member) => member.name === 'getValue'
			)
		);

		assert.deepEqual(
			editor.props.map((prop) => prop.name),
			['delay', 'instance', 'language', 'onChange', 'value']
		);
		assert.equal(
			editor.props.find((prop) => prop.name === 'value').required,
			true
		);
		assert.equal(
			editor.props.find((prop) => prop.name === 'delay').default,
			'10'
		);
		assert.equal(
			editor.props.find((prop) => prop.name === 'onChange').type,
			'OnChange'
		);
		assert.deepEqual(
			editor.props.find((prop) => prop.name === 'onChange')
				.callSignatures,
			['(value: string | undefined): void']
		);
		assert.equal(
			editor.props.find((prop) => prop.name === 'language').default,
			'"yaml"'
		);
		assert.equal(editor.refHandle.type, 'Handle');
		assert.equal(editor.refHandle.members[0].name, 'focus');
		assert.equal(
			editor.props.find((prop) => prop.name === 'value').description,
			'Current parent-owned value.'
		);
		assert.equal(contract('Plain').props[0].default, 'true');
		assert.equal(contract('Factory'), undefined);
		assert.doesNotMatch(
			JSON.stringify(editor),
			/node_modules|\/Users\/|\/private\/tmp\//
		);
		const rendered = renderContracts(
			'@test/react',
			{
				PublicEditor: {
					...editor,
					signature: '(props: Props): ReactNode | null',
					entries: ['./client']
				}
			},
			(value) => String(value).replaceAll('|', '\\|'),
			'https://github.com/example/ui/blob/dev/packages/react-ui-components/'
		);
		const signatureLine = rendered
			.split('\n')
			.find((line) => line.startsWith('Signature:'));

		assert.doesNotMatch(signatureLine, /\\\|/);
		assert.match(signatureLine, /ReactNode \| null/);
		assert.match(rendered, /@test\/react\/client/);
		assert.match(rendered, /Promise&lt;boolean&gt;/);
		assert.match(rendered, /\(value: string \\\| undefined\): void/);
		assert.match(
			rendered,
			/\[Source\]\(https:\/\/github\.com\/example\/ui\/blob\/dev\/packages\/react-ui-components\/src\/components\/Editor\.tsx\)/
		);
		const external = renderContracts(
			'@test/react',
			{
				ExternalEditor: {
					...editor,
					entries: ['./client'],
					refHandle: { type: 'IStandaloneCodeEditor', members: [] }
				}
			},
			String,
			'https://github.com/example/ui/blob/dev/packages/react-ui-components/'
		);

		assert.match(external, /IStandaloneCodeEditor/);
		assert.match(external, /installed TypeScript declarations/);
		assert.doesNotMatch(external, /\| Member \|/);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
