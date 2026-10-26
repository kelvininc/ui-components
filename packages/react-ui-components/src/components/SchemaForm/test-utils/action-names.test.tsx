// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../test-utils';
import { KvSchemaForm } from '../SchemaForm';
import { ACTION_NAME_SHAPES } from './matrix';

vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);

describe.each(ACTION_NAME_SHAPES)('action names: $name', row => {
	it('names existing actions and preserves their change callbacks', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		const onChange = vi.fn();
		try {
			await act(async () => root.render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />));
			const controls = Array.from(container.querySelectorAll('kv-action-button-icon, kv-action-button-text'));
			expect(controls.map(control => propsOf(control).accessibleLabel || propsOf(control).text)).toEqual([...row.labels, 'Submit']);
			onChange.mockClear();
			await act(async () => fireStencilEvent(row.action.label, 'onClickButton'));
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange.mock.lastCall?.[0].formData).toEqual(row.action.nextData);
		} finally {
			await act(async () => root.unmount());
		}
	});
});
