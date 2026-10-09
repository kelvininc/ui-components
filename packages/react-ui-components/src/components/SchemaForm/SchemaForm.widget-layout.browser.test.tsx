import { EIconName, setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { FILE_FEEDBACK_LAYOUT_SHAPES, RADIO_FEEDBACK_LAYOUT_SHAPES, RADIO_KEYBOARD_SHAPES, WIDGET_ENTRY_LAYOUT_SHAPES } from './test-utils/matrix';
import fieldStyles from './Templates/FieldTemplate/FieldTemplate.module.scss';
import fileStyles from './Widgets/FileWidget/FileWidget.module.scss';

afterEach(() => setThemeMode(StyleMode.Night));

const centerY = (element: Element) => {
	const bounds = element.getBoundingClientRect();
	return bounds.top + bounds.height / 2;
};

const textBounds = (element: Element) => {
	const range = document.createRange();
	range.selectNodeContents(element);
	return range.getClientRects()[0];
};

describe.each([StyleMode.Light, StyleMode.Night])('widget layout in %s', theme => {
	describe.each([200, 320, 800])('radio feedback at %ipx', width => {
		describe.each(RADIO_KEYBOARD_SHAPES)('$name', ({ widget }) => {
			it.each(RADIO_FEEDBACK_LAYOUT_SHAPES)('keeps Clear selection beside $name without overlap', async row => {
				setThemeMode(theme);
				const screen = await render(
					<div style={{ width }}>
						<KvSchemaForm
							schema={{
								type: 'string',
								title: 'Delivery policy',
								enum: ['At most once', 'At least once'],
								description: row.description,
								default: row.defaultValue
							}}
							uiSchema={{ 'ui:widget': widget, 'ui:options': { showDefaultValueHelper: true } }}
							formData={row.unset ? undefined : 'At least once'}
							extraErrors={row.error ? { __errors: [row.error] } : undefined}
							displayErrors
							showErrorList={false}
						/>
					</div>
				);
				await whenAllKelvinReady(screen.container);
				const radio = screen.container.querySelector('kv-radio-list')!;
				const clear = screen.getByRole('button', { name: 'Clear selection for Delivery policy', exact: true }).element();
				const field = radio.closest('[data-schema-form-field]')!;
				const helpers = Array.from(field.querySelectorAll('kv-form-help-text'));
				const annotation = Array.from(field.querySelectorAll('span')).find(span => span.textContent === 'Not set');
				const firstText = helpers[0]?.shadowRoot!.querySelector('.help-text') || annotation;
				const clearBox = clear.getBoundingClientRect();
				const fieldBox = field.getBoundingClientRect();
				expect(clearBox.right).toBeCloseTo(radio.getBoundingClientRect().right, 0);
				expect(clearBox.left).toBeGreaterThanOrEqual(fieldBox.left);
				expect(clearBox.bottom).toBeLessThanOrEqual(fieldBox.bottom);
				if (firstText) {
					if (width === 200 && helpers.length) {
						const lastText = annotation || helpers.at(-1)!;
						expect(clearBox.top).toBeGreaterThanOrEqual(lastText.getBoundingClientRect().bottom);
					} else expect(Math.abs(textBounds(clear).bottom - textBounds(firstText).bottom)).toBeLessThanOrEqual(2);
				}
				for (const helper of helpers) {
					const text = helper.shadowRoot!.querySelector('.help-text')!;
					const textBox = text.getBoundingClientRect();
					// The default helper goes to the inline end when the footer its container query measures is wider than 460px
					const footer = helper.closest(`.${fieldStyles.FieldFooter}`)?.getBoundingClientRect();
					if ((helper as HTMLKvFormHelpTextElement).helpText === `Default: ${row.defaultValue}` && footer && footer.width > 460) {
						expect(footer.right - textBox.right).toBeLessThanOrEqual(4);
					} else expect(textBox.left).toBeCloseTo(radio.getBoundingClientRect().left, 0);
					expect(textBox.right).toBeLessThanOrEqual(fieldBox.right);
					expect(textBox.right <= clearBox.left || textBox.bottom <= clearBox.top || textBox.top >= clearBox.bottom).toBe(true);
				}
				if (row.error) {
					const control = screen.getByRole('radio', { name: 'At most once', exact: true }).element();
					await expect.poll(() => control.ariaDescribedByElements?.[0]).toBe(helpers[0].parentElement);
				}
			});
		});
	});

	describe.each([320, 800])('at %ipx', width => {
		it.each(WIDGET_ENTRY_LAYOUT_SHAPES)('uses consistent entry spacing and alignment for $name', async row => {
			setThemeMode(theme);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} showErrorList={false} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const radio = screen.container.querySelector('kv-radio-list');
			const entries = radio
				? Array.from(radio.shadowRoot!.querySelectorAll('kv-radio-list-item'))
				: Array.from(screen.container.querySelectorAll(row.kind === 'file' ? '[data-file-index]' : '[data-schema-form-list-item]'));
			expect(entries.length).toBeGreaterThanOrEqual(2);
			for (let index = 1; index < entries.length; index++) {
				expect(entries[index].getBoundingClientRect().top - entries[index - 1].getBoundingClientRect().bottom).toBeCloseTo(12, 0);
			}
			if (radio) {
				const field = radio.closest('[data-schema-form-field]')!;
				expect(radio.getBoundingClientRect().left).toBeCloseTo(field.getBoundingClientRect().left, 0);
				const clear = screen.getByRole('button', { name: 'Clear selection for Delivery policy', exact: true }).element();
				expect(clear.getBoundingClientRect().right).toBeCloseTo(radio.getBoundingClientRect().right, 0);
				for (const item of entries) {
					const box = item.shadowRoot!.querySelector('.radio-list-item-container')!;
					const expected =
						theme === StyleMode.Light
							? 'rgb(255, 255, 255)'
							: row.name === 'RadioWidget' && !(item as HTMLKvRadioListItemElement).checked
							? 'rgb(64, 64, 64)'
							: 'rgb(38, 38, 38)';
					await expect.poll(() => getComputedStyle(box).backgroundColor).toBe(expected);
				}
			} else if (row.kind === 'file') {
				for (const entry of entries) {
					const icon = entry.querySelector('kv-icon')!;
					const text = entry.querySelector(`.${fileStyles.FileDetails}`)!;
					expect(centerY(text)).toBeCloseTo(centerY(icon), 0);
				}
				expect(screen.container.querySelector('kv-action-button-text')!.icon).toBe(EIconName.Add);
			} else expect(screen.container.querySelector('kv-action-button kv-icon')!.getAttribute('name')).toBe(EIconName.Add);
		});

		it.each(FILE_FEEDBACK_LAYOUT_SHAPES)('places errors between the card and picker for $name', async row => {
			setThemeMode(theme);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown> schema={row.schema} formData={row.formData} extraErrors={{ __errors: [row.message] }} displayErrors showErrorList={false} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const error = screen.container.querySelector('[id$="-errors"] kv-form-help-text')!;
			const card = screen.container.querySelector(`.${fileStyles.FileInfo}`)!;
			const picker = screen.container.querySelector('kv-action-button-text')!;
			await expect.element(error).toBeVisible();
			expect(error.getBoundingClientRect().top).toBeGreaterThanOrEqual(card.getBoundingClientRect().bottom);
			expect(error.getBoundingClientRect().bottom).toBeLessThanOrEqual(picker.getBoundingClientRect().top);
			expect(error.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect().left).toBeCloseTo(card.getBoundingClientRect().left, 0);
			const button = screen.getByRole('button', { name: picker.accessibleLabel, exact: true }).element();
			await expect.poll(() => button.ariaDescribedByElements?.[0]).toBe(error.parentElement);
		});
	});
});
