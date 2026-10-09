import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { RJSFSchema } from '@rjsf/utils';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { DROPDOWN_LABEL_SHAPES, EMPTY_DROPDOWN_SHAPES } from './test-utils/matrix';

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
			const defaultClearLabel = multiple ? 'Clear all' : 'Clear selection';
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
				// Accessible names collapse whitespace, so check the props for trimming.
				expect(host).toHaveProperty('clearSelectionLabel', clearLabel);
				if (multiple) expect(host).toHaveProperty('selectAllLabel', selectLabel);
				expect(screen.container.querySelector(selector)).toBe(host);
				await expect.element(trigger).toHaveValue('0');
			};
			await expectLabels(multiple ? row.clearLabel : row.singleClearLabel ?? row.clearLabel, row.selectLabel);
			await screen.rerender(form({ clearSelectionLabel: 'Clear retry policy', selectAllLabel: 'Select every retry count' }));
			await expectLabels('Clear retry policy', 'Select every retry count');
			await screen.rerender(form({}));
			await expectLabels(defaultClearLabel, 'Select all');
			await screen.rerender(form({ clearSelectionLabel: undefined, selectAllLabel: undefined }));
			await expectLabels(defaultClearLabel, 'Select all');
			await screen.rerender(form({}, false));
			await expect.element(page.getByRole('button', { name: defaultClearLabel, exact: true })).not.toBeInTheDocument();
			await screen.rerender(form({}));
			await expectLabels(defaultClearLabel, 'Select all');

			if (multiple) {
				onChange.mockClear();
				await page.getByRole('button', { name: 'Select all', exact: true }).click();
				await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual([0, 2]);
				expect(onChange).toHaveBeenCalledOnce();
				await expect.element(page.getByRole('button', { name: 'Select all', exact: true })).toHaveAttribute('aria-disabled', 'true');
			}
			onChange.mockClear();
			await page.getByRole('button', { name: defaultClearLabel, exact: true }).click();
			await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual(multiple ? [] : undefined);
			expect(onChange).toHaveBeenCalledOnce();
			await expect.element(page.getByRole('button', { name: defaultClearLabel, exact: true })).toHaveAttribute('aria-disabled', 'true');
		});
	});
});

describe.each(['light', 'night'])('empty dropdowns in %s', theme => {
	it.each(EMPTY_DROPDOWN_SHAPES)('shows the no-data state for $name', async row => {
		document.body.setAttribute('mode', theme);
		const schema: RJSFSchema = { type: 'object', properties: { brokers: row.schema } };
		const screen = await render(<KvSchemaForm schema={schema} uiSchema={{ brokers: row.uiSchema }} showErrorList={false} />);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('textbox', { name: String(row.schema.title), exact: true }).click();
		await expect.element(page.getByText('No data available', { exact: true })).toBeVisible();
		await expect.element(page.getByText('There is no data to display at the moment.', { exact: true })).toBeVisible();
	});
});
