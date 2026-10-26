import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { RJSFSchema } from '@rjsf/utils';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { DROPDOWN_LABEL_SHAPES } from './test-utils/matrix';

describe.each(['light', 'night'])('dropdown action labels in %s', theme => {
	describe.each([false, true])('multiple=%s', multiple => {
		it.each(DROPDOWN_LABEL_SHAPES)('keeps $name labels, restores defaults and preserves selection actions', async row => {
			document.body.setAttribute('mode', theme);
			const choice: RJSFSchema = { type: 'integer', title: 'Retry count', enum: [0, 2] };
			const schema: RJSFSchema = {
				type: 'object',
				properties: { choice: multiple ? { type: 'array', title: 'Retry counts', uniqueItems: true, items: choice } : choice }
			};
			const formData = { choice: multiple ? [0] : 0 };
			const onChange = vi.fn();
			const uiSchema = (labels: typeof row.labels, allowClearInputs = true) => ({
				choice: { 'ui:widget': 'select', 'ui:options': { allowClearInputs }, 'selectionAll': multiple, ...labels }
			});
			const form = (labels: typeof row.labels, allowClearInputs = true) => (
				<KvSchemaForm schema={schema} uiSchema={uiSchema(labels, allowClearInputs)} formData={formData} onChange={onChange} showErrorList={false} />
			);
			const screen = await render(form(row.labels));
			await whenAllKelvinReady(screen.container);
			const selector = multiple ? 'kv-multi-select-dropdown' : 'kv-single-select-dropdown';
			const host = screen.container.querySelector(selector);
			const trigger = screen.getByRole('textbox', { name: multiple ? 'Retry counts' : 'Retry count', exact: true });
			await expect.element(trigger).toHaveValue('0');
			await trigger.click();
			const expectLabels = async (clearLabel: string, selectLabel: string) => {
				await expect.element(page.getByRole('button', { name: clearLabel, exact: true })).toBeVisible();
				if (multiple) await expect.element(page.getByRole('button', { name: selectLabel, exact: true })).toBeVisible();
				expect(screen.container.querySelector(selector)).toBe(host);
				await expect.element(trigger).toHaveValue('0');
			};
			await expectLabels(row.clearLabel, row.selectLabel);
			await screen.rerender(form({ clearSelectionLabel: 'Clear retry policy', selectAllLabel: 'Select every retry count' }));
			await expectLabels('Clear retry policy', 'Select every retry count');
			await screen.rerender(form({}));
			await expectLabels('Clear all', 'Select all');
			await screen.rerender(form({ clearSelectionLabel: undefined, selectAllLabel: undefined }));
			await expectLabels('Clear all', 'Select all');
			await screen.rerender(form({}, false));
			await expect.element(page.getByRole('button', { name: 'Clear all', exact: true })).not.toBeInTheDocument();
			await screen.rerender(form({}));
			await expectLabels('Clear all', 'Select all');

			if (multiple) {
				onChange.mockClear();
				await page.getByRole('button', { name: 'Select all', exact: true }).click();
				await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual([0, 2]);
				expect(onChange).toHaveBeenCalledOnce();
				await expect.element(page.getByRole('button', { name: 'Select all', exact: true })).toHaveAttribute('aria-disabled', 'true');
			}
			onChange.mockClear();
			await page.getByRole('button', { name: 'Clear all', exact: true }).click();
			await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual(multiple ? [] : undefined);
			expect(onChange).toHaveBeenCalledOnce();
			await expect.element(page.getByRole('button', { name: 'Clear all', exact: true })).toHaveAttribute('aria-disabled', 'true');
		});
	});
});
