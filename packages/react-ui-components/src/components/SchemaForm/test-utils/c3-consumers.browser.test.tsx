import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { HELP_TEXT_CONSUMER_SHAPES, TEXTAREA_CONSUMER_SHAPES, TEXTAREA_VALIDATION_SHAPES } from './matrix';

describe.each(TEXTAREA_CONSUMER_SHAPES)('C3 textarea consumer: $name', row => {
	it('preserves the text and emits one existing change callback on fill', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: row.label, exact: true });
		await expect.element(control).toBeVisible();
		expect((control.element() as HTMLElement).innerText).toBe(row.formData);
		onChange.mockClear();
		await control.fill(row.nextText);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toBe(row.nextText);
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});

describe.each(TEXTAREA_VALIDATION_SHAPES)('C3 textarea validation: $name', row => {
	it('matches displayed errors, delegates host focus and clears invalid state when errors clear', async () => {
		const form = (extraErrors: typeof row.extraErrors) => (
			<KvSchemaForm<Record<string, unknown>>
				schema={row.schema}
				uiSchema={row.uiSchema}
				formData={row.formData}
				extraErrors={extraErrors}
				displayErrors={row.displayErrors}
				showErrorList={false}
			/>
		);
		const screen = await render(form(row.extraErrors));
		await whenAllKelvinReady(screen.container);
		const host = screen.container.querySelector<HTMLKvTextAreaElement>('kv-text-area')!;
		host.style.setProperty('--border-color-error', 'rgb(210,30,40)');
		host.style.setProperty('--text-area-border-thickness-default', '1px');
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		const assertValidation = async (invalid: boolean) => {
			const input = host.shadowRoot!.querySelector('[role="textbox"]')!;
			const wrapper = host.shadowRoot!.querySelector('.text-area-wrapper')!;
			await expect
				.poll(() => ({
					state: host.getAttribute('state'),
					ariaInvalid: input.getAttribute('aria-invalid'),
					invalidClass: wrapper.classList.contains('invalid'),
					errorBorder: getComputedStyle(wrapper).borderColor === 'rgb(210, 30, 40)',
					displayedErrors: Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'))
						.filter(help => help.state === 'invalid')
						.map(help => help.helpText)
				}))
				.toEqual({
					state: invalid ? 'invalid' : 'none',
					ariaInvalid: invalid ? 'true' : null,
					invalidClass: invalid,
					errorBorder: invalid,
					displayedErrors: invalid ? [['Explain why this connection is needed']] : []
				});
		};
		await assertValidation(row.initialInvalid);
		await expect.element(control).toBeVisible();
		expect(host.id).toBe('root_notes');
		host.focus();
		await expect.poll(() => host.shadowRoot!.activeElement === control.element()).toBe(true);
		await assertValidation(row.touchedInvalid);
		await screen.rerender(form({}));
		await whenAllKelvinReady(screen.container);
		await assertValidation(false);
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
