import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { BROKER_FORM_DATA, BROKER_SCHEMA, ERROR_SHAPES, R2_ERROR_DESCRIPTION_SHAPES, R2_SECTION_ERROR_SHAPE, R2_SELECTOR_OWNER_SHAPES } from './test-utils/matrix';

function controlsWithin(host: Element): Element[] {
	const controls: Element[] = [];
	const visit = (node: Element) => {
		if (node.matches('input:not([type="hidden"]),[role="textbox"],[role="radio"],[role="checkbox"]')) controls.push(node);
		for (const child of node.children) visit(child);
		if (node.shadowRoot) for (const child of node.shadowRoot.children) visit(child);
	};
	visit(host);
	return controls;
}

for (const liveValidate of [false, true])
	for (const extraErrorsBlockSubmit of [false, true]) {
		describe.each(ERROR_SHAPES)(`real error placement: $name, live=${liveValidate}, block=${extraErrorsBlockSubmit}`, row => {
			it('renders each message under its field and matches Save gating', async () => {
				const screen = await render(
					<KvSchemaForm
						schema={BROKER_SCHEMA}
						formData={BROKER_FORM_DATA}
						extraErrors={row.extraErrors as never}
						displayErrors
						showErrorList={false}
						liveValidate={liveValidate}
						extraErrorsBlockSubmit={extraErrorsBlockSubmit}
					/>
				);
				await whenAllKelvinReady(screen.container);
				for (const { id, message } of row.messages) {
					const owner =
						id === 'root'
							? screen.container.querySelector('[data-schema-form-field="section"]')!
							: screen.container.querySelector(`[id="${id}"]`)!.closest('[data-schema-form-field]')!;
					const help = Array.from(owner.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text')).find(
						host => Array.isArray(host.helpText) && host.helpText.includes(message)
					);
					expect(help).toBeDefined();
					expect(help!.shadowRoot!.textContent).toContain(message);
				}
				const save = screen.getByRole('button', { name: 'Submit', exact: true });
				if (liveValidate && extraErrorsBlockSubmit && row.messages.length) await expect.element(save).toBeDisabled();
				else await expect.element(save).toBeEnabled();
				const invalid = Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text')).filter(host => host.state === 'invalid');
				expect(invalid.flatMap(host => host.helpText as string[])).toEqual(row.messages.map(({ message }) => message));
			});
		});
	}

describe.each(R2_ERROR_DESCRIPTION_SHAPES)('real error description: $name', row => {
	it('links the actual control to its own mounted error help, then clears the relationship', async () => {
		const { fields: expectedFields, ...formProps } = row;
		const form = (extraErrors: typeof row.extraErrors) => <KvSchemaForm {...formProps} extraErrors={extraErrors} displayErrors showErrorList={false} />;
		const screen = await render(form(row.extraErrors));
		await whenAllKelvinReady(screen.container);
		for (const field of expectedFields) {
			const hosts = Array.from(screen.container.querySelectorAll(field.tag)).filter(host => field.id === 'root' || host.id === field.id);
			expect(hosts.length).toBeGreaterThan(0);
			for (const host of hosts) {
				const controls = controlsWithin(host);
				expect(controls.length).toBeGreaterThan(0);
				for (const control of controls) {
					// Browser matcher implementations only read string ids, which can't cross shadow roots.
					await expect.poll(() => control.ariaDescribedByElements?.map(element => element.id)).toEqual([expect.stringMatching(/-errors$/)]);
					const [help] = control.ariaDescribedByElements!;
					expect(help.closest('[data-schema-form-field]')).toBe(host.closest('[data-schema-form-field]'));
					expect(help.querySelector<HTMLKvFormHelpTextElement>('kv-form-help-text')!.helpText).toEqual([field.message]);
				}
			}
		}
		await screen.rerender(form({}));
		await whenAllKelvinReady(screen.container);
		for (const field of expectedFields)
			for (const host of screen.container.querySelectorAll(field.tag)) {
				for (const control of controlsWithin(host)) await expect.poll(() => control.ariaDescribedByElements ?? []).toEqual([]);
			}
	});
});

describe.each(R2_SELECTOR_OWNER_SHAPES)('real option-selector ownership: $name', row => {
	it('reveals its owner and ancestors when the actual selector is focused', async () => {
		const { name: _name, selectorId, ...props } = row;
		const screen = await render(<KvSchemaForm {...props} showErrorList={false} />);
		await whenAllKelvinReady(screen.container);
		expect(screen.container.querySelector(`[id="${selectorId}"]`)).not.toBeNull();
		const messages = () =>
			Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'))
				.filter(host => host.state === 'invalid')
				.flatMap(host => host.helpText as string[]);
		expect(messages()).toEqual([]);
		await screen.getByRole('textbox', { name: 'Authentication', exact: true }).click();
		await expect.poll(messages).toEqual(expect.arrayContaining(['Connection failed', 'Authentication failed']));
		expect(messages()).not.toContain('Audit mode failed');
	});
});

it('shows parent errors on a descendant focus and resets them when changes are discarded', async () => {
	const props = { ...R2_SECTION_ERROR_SHAPE, submittedData: { tls: { host: 'broker-0.local' }, tls_version: '1.3' }, allowDiscardChanges: true, showErrorList: false as const };
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm<Record<string, unknown>> {...props} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	const messages = () =>
		Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'))
			.filter(host => host.state === 'invalid')
			.flatMap(host => host.helpText as string[]);
	expect(messages()).toEqual([]);
	await screen.getByRole('textbox', { name: 'Host', exact: true }).click();
	await expect.poll(messages).toEqual(['Connection failed', 'TLS failed']);
	await screen.getByRole('button', { name: 'Discard Changes', exact: true }).click();
	await expect.poll(messages).toEqual([]);
	expect(onChange.mock.lastCall?.[0].formData).toEqual(props.submittedData);
});
