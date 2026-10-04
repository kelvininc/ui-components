// @vitest-environment jsdom

import Form from '@rjsf/core';
import { RJSFSchema, getWidget } from '@rjsf/utils';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { TEMPLATE_COMPONENTS } from '../test-utils/matrix';

const schema: RJSFSchema = { type: 'string', title: 'Broker host' };
const validator = getDefaultValidator();
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	container = document.createElement('div');
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
});

describe.each(TEMPLATE_COMPONENTS)('RJSF 6 with the $name component', ({ name, FieldLayout, InputWidget }) => {
	it('renders a field template, including memo and forwardRef templates', async () => {
		await act(async () => root.render(<Form schema={schema} formData="broker-1.local" validator={validator} templates={{ FieldTemplate: FieldLayout }} />));

		expect(container.querySelector('[data-field-layout] input')?.getAttribute('id')).toBe('root');
		expect(container.querySelector('input')?.value).toBe('broker-1.local');
	});

	it('pins getWidget acceptance with RJSF 6.11.0 and React 19', async () => {
		if (name === 'function') {
			expect(typeof getWidget(schema, InputWidget)).toBe('function');
			await act(async () => root.render(<Form schema={schema} formData="broker-1.local" validator={validator} uiSchema={{ 'ui:widget': InputWidget }} />));
			expect(container.querySelector('input')?.value).toBe('broker-1.local');
		} else {
			// RJSF uses react-is 18; its checks reject memo objects and React 19 forwardRef widgets.
			expect(() => getWidget(schema, InputWidget)).toThrow('Unsupported widget definition: object');
		}
	});
});
