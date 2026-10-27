// @vitest-environment jsdom

import type { IToggleButton } from '@kelvininc/ui-components';
import type { RJSFSchema } from '@rjsf/utils';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../../test-utils';
import { KvSchemaForm } from '../../SchemaForm';
import { TOGGLE_BUTTON_GROUP_SHAPES } from '../../test-utils/matrix';

vi.mock('../../../../stencil-generated', async () => (await import('../../../../test-utils')).stencilMocks);

describe.each(TOGGLE_BUTTON_GROUP_SHAPES)('toggle widget: $name', row => {
	it('matches its control semantics to its selection behavior', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		const onChange = vi.fn();
		try {
			await act(async () => root.render(<KvSchemaForm {...row} onChange={onChange} />));
			const group = container.querySelector('kv-toggle-button-group')!;
			expect(propsOf(group).radioControlType).toBe('checkbox');
			// The group emits the pressed button's key, which the widget maps back to its choice's value
			const title = ((row.schema.items as RJSFSchema).oneOf as RJSFSchema[]).find(option => option.const === row.nextValue)!.title;
			const button = (propsOf(group).buttons as IToggleButton[]).find(({ label }) => label === title)!;
			await act(async () => {
				fireStencilEvent(group, 'onCheckedChange', button.value);
			});
			expect(onChange.mock.lastCall?.[0].formData).toEqual(row.nextSelection);
		} finally {
			await act(async () => root.unmount());
		}
	});
});
