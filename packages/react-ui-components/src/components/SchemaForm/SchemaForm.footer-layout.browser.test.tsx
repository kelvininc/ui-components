import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import type { RJSFSchema } from '@rjsf/utils';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import styles from './SchemaForm.module.scss';
import { FOOTER_LAYOUT_SHAPES, RESET_STATE_SHAPES } from './test-utils/matrix';

afterEach(() => setThemeMode(StyleMode.Night));

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

describe.each([StyleMode.Light, StyleMode.Night])('footer actions in %s', theme => {
	it.each(FOOTER_LAYOUT_SHAPES)('keeps text actions aligned and separated in a $name', async row => {
		setThemeMode(theme);
		const broker = RESET_STATE_SHAPES[0];
		const root = 'root' in row ? row.root : 'scalar';
		const formData = root === 'object' ? { broker: broker.formData } : root === 'array' ? [broker.formData] : broker.formData;
		const schema: RJSFSchema =
			root === 'object'
				? { type: 'object', properties: { broker: broker.schema }, default: formData as RJSFSchema['default'] }
				: root === 'array'
				? { type: 'array', title: 'Brokers', items: broker.schema, default: formData as RJSFSchema['default'] }
				: broker.schema;
		const screen = await render(
			<div style={{ width: row.width }}>
				<KvSchemaForm
					schema={schema}
					formData={formData}
					submittedData={formData}
					allowResetToDefaults={row.reset}
					allowDiscardChanges={row.discard}
					liveValidate
					uiSchema={{ 'ui:submitButtonOptions': { submitText: 'Save' } }}
				/>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const form = screen.container.querySelector<HTMLElement>(`.${styles.FormContainer}`)!;
		form.style.setProperty('--schema-form-x-padding', `${row.padding}px`);
		form.style.setProperty('--schema-form-max-width', 'maxWidth' in row ? row.maxWidth : '100%');
		const footer = form.querySelector(`.${styles.FormFooter}`)!;
		const field = form.querySelector('kv-text-field')!;
		const content = root === 'array' ? form.querySelector('form > [data-schema-form-field] > div')! : field;
		const textActions = [...footer.querySelectorAll<HTMLKvActionButtonTextElement>('kv-action-button-text[type="tertiary"]')];
		const actionNames = [...(row.reset ? ['Reset to defaults'] : []), ...(row.discard ? ['Discard changes'] : []), 'Save'];
		const buttons = actionNames.map(name => screen.getByRole('button', { name, exact: true }).element());
		const initialColors = textActions.map(host => getComputedStyle(screen.getByRole('button', { name: host.text!, exact: true }).element()).color);

		const checkLayout = () => {
			const bounds = content.getBoundingClientRect();
			const boxes = buttons.map(button => button.getBoundingClientRect());
			for (const box of boxes) {
				expect(box.left).toBeGreaterThanOrEqual(bounds.left - 0.5);
				expect(box.right).toBeLessThanOrEqual(bounds.right + 0.5);
				expect(box.height).toBe(40);
			}
			for (let index = 1; index < boxes.length; index++) {
				const previous = boxes[index - 1];
				const current = boxes[index];
				if (current.top < previous.bottom && current.bottom > previous.top) expect(current.left - previous.right).toBeGreaterThanOrEqual(11.5);
				else expect(current.top - previous.bottom).toBeGreaterThanOrEqual(11.5);
			}
			expect(boxes[boxes.length - 1].right).toBeCloseTo(bounds.right, 0);
			for (const host of textActions) {
				const button = screen.getByRole('button', { name: host.text!, exact: true }).element();
				const text = host.shadowRoot!.querySelector('[part="button-text"]')!;
				expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
				expect(getComputedStyle(button).backgroundImage).toBe('none');
				expect(getComputedStyle(button).borderWidth).toBe('0px');
				expect(text.getBoundingClientRect().left).toBeCloseTo(button.getBoundingClientRect().left, 0);
			}
			if (row.reset) expect(boxes[0].left).toBeCloseTo(bounds.left, 0);
		};

		for (const name of actionNames) await expect.element(screen.getByRole('button', { name, exact: true })).toBeDisabled();
		checkLayout();
		await screen.getByRole('textbox').fill('broker-2.local');
		for (const name of actionNames) await expect.element(screen.getByRole('button', { name, exact: true })).toBeEnabled();
		checkLayout();
		buttons[0].focus();
		await userEvent.tab({ shift: true });
		for (const name of actionNames) {
			await userEvent.tab();
			const button = screen.getByRole('button', { name, exact: true });
			await expect.poll(focusedControl).toBe(button.element());
			expect(getComputedStyle(button.element()).outlineStyle).not.toBe('none');
			expect(parseFloat(getComputedStyle(button.element()).outlineWidth)).toBeGreaterThan(0);
		}
		for (const host of textActions) {
			await userEvent.hover(screen.getByRole('button', { name: host.text!, exact: true }).element());
			checkLayout();
		}
		textActions.forEach((host, index) =>
			expect(getComputedStyle(screen.getByRole('button', { name: host.text!, exact: true }).element()).color).not.toBe(initialColors[index])
		);
		if (row.discard || row.reset) {
			await screen.getByRole('button', { name: row.discard ? 'Discard changes' : 'Reset to defaults', exact: true }).click();
			for (const name of actionNames) await expect.element(screen.getByRole('button', { name, exact: true })).toBeDisabled();
			checkLayout();
			textActions.forEach((host, index) =>
				expect(getComputedStyle(screen.getByRole('button', { name: host.text!, exact: true }).element()).color).toBe(initialColors[index])
			);
		}
	});
});
