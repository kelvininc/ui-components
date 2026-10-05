import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { HELP_TEXT_CONSUMER_SHAPES, TEXTAREA_CONSUMER_SHAPES } from './matrix';

describe.each(TEXTAREA_CONSUMER_SHAPES)('C3 textarea consumer: $name', row => {
	it('preserves the text and emits one existing change callback on fill', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox');
		await expect.element(control).toBeVisible();
		expect((control.element() as HTMLElement).innerText).toBe(row.formData);
		onChange.mockClear();
		await control.fill(row.nextText);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toBe(row.nextText);
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});

describe.each(HELP_TEXT_CONSUMER_SHAPES)('C3 help text consumers: $name', row => {
	it('inherits error weight in the field and error list while ordinary help stays regular', async () => {
		const screen = await render(
			<div style={{ '--help-text-error-font-weight': 600 } as React.CSSProperties}>
				<KvSchemaForm<Record<string, unknown>>
					schema={row.schema}
					uiSchema={row.uiSchema}
					formData={row.formData}
					extraErrors={row.extraErrors}
					showErrorList="top"
					displayErrors
				/>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const helpTexts = Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'));
		const invalid = helpTexts.filter(host => host.state === 'invalid');
		const regular = helpTexts.filter(host => host.state !== 'invalid');
		expect(invalid).toHaveLength(2);
		const messages = regular.flatMap(host => (Array.isArray(host.helpText) ? host.helpText : [host.helpText]));
		expect(messages).toEqual(expect.arrayContaining(row.regularMessages));
		for (const host of helpTexts) {
			const text = host.shadowRoot!.querySelector('.help-text')!;
			expect(getComputedStyle(text).fontWeight).toBe(host.state === 'invalid' ? '600' : '400');
		}
	});
});
