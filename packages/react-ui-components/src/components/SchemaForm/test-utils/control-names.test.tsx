// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../test-utils';
import { KvSchemaForm } from '../SchemaForm';
import { CONTROL_NAME_SHAPES } from './matrix';

vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);

describe.each(CONTROL_NAME_SHAPES)('choice control names: $name', row => {
	it('forwards the control names and preserves the selected value', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		const onChange = vi.fn();
		try {
			await act(async () => root.render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />));
			const controls = Array.from(container.querySelectorAll(row.role === 'checkbox' ? 'kv-checkbox' : 'kv-radio-list-item'));
			expect(controls.map(control => propsOf(control)[row.role === 'checkbox' ? 'accessibleLabel' : 'label'])).toEqual(row.labels);
			await act(async () => {
				fireStencilEvent(controls[0], row.role === 'checkbox' ? 'onClickCheckbox' : 'onOptionClick');
			});
			expect(onChange.mock.lastCall?.[0].formData).toEqual(row.nextValue);
		} finally {
			await act(async () => root.unmount());
		}
	});
});
