import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import fieldStyles from './Templates/FieldTemplate/FieldTemplate.module.scss';
import { DEFAULT_FOOTER_DESCRIPTION_POSITIONS, FIELD_FEEDBACK_SHAPES } from './test-utils/matrix';

// The default helper shows a choice by its option label, so a boolean default reads as Yes/No
const defaultLabel = (value: unknown) => (typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value));

describe.each([StyleMode.Light, StyleMode.Night])('field feedback in %s', theme => {
	describe.each([200, 320, 460, 480, 800])('default footer at %ipx', width => {
		it.each(DEFAULT_FOOTER_DESCRIPTION_POSITIONS)('wraps a long default with description position %s', async descriptionPosition => {
			setThemeMode(theme);
			try {
				const value = 'mqtt/production/north-plant/compressor-station/primary-gateway/telemetry';
				const screen = await render(
					<div style={{ width }}>
						<KvSchemaForm
							schema={{ type: 'string', title: 'Broker hostname', description: 'Broker used for production telemetry.', default: value }}
							uiSchema={{ 'ui:showDefaultValueHelper': true, 'ui:descriptionPosition': descriptionPosition }}
							formData="mqtt.production.local"
							showErrorList={false}
						/>
					</div>
				);
				await whenAllKelvinReady(screen.container);
				const helpers = Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'));
				const helper = helpers.find(host => host.helpText === `Default: ${value}`)!;
				const text = helper.shadowRoot!.querySelector('.help-text')!;
				expect(text.textContent).toBe(`Default: ${value}`);
				const textBox = text.getBoundingClientRect();
				const fieldBox = helper.closest('[data-schema-form-field]')!.getBoundingClientRect();
				expect(textBox.left).toBeGreaterThanOrEqual(fieldBox.left);
				expect(textBox.right).toBeLessThanOrEqual(fieldBox.right);
				const range = document.createRange();
				range.selectNodeContents(text);
				for (const fragment of Array.from(range.getClientRects())) {
					expect(fragment.left).toBeGreaterThanOrEqual(fieldBox.left);
					expect(fragment.right).toBeLessThanOrEqual(fieldBox.right);
				}
				if (width <= 460) expect(textBox.left).toBeCloseTo(fieldBox.left, 0);
				else expect(fieldBox.right - textBox.right).toBeLessThanOrEqual(4);
				const description = helpers.find(host => host !== helper);
				if (description) {
					const descriptionBox = description.getBoundingClientRect();
					expect(textBox.left >= descriptionBox.right || textBox.top >= descriptionBox.bottom).toBe(true);
				}
			} finally {
				setThemeMode(StyleMode.Night);
			}
		});
	});
	describe.each([320, 800])('at %ipx', width => {
		it.each(FIELD_FEEDBACK_SHAPES)('aligns descriptions, errors and default helpers for $name', async row => {
			setThemeMode(theme);
			try {
				const form = (invalid: boolean) => (
					<div style={{ width }}>
						<KvSchemaForm<unknown> {...row} displayErrors showErrorList={false} extraErrors={invalid ? { __errors: ['Review this connection setting.'] } : undefined} />
					</div>
				);
				const screen = await render(form(false));
				const insets: number[] = [];
				let rightAligned = 0;
				for (const invalid of [false, true]) {
					if (invalid) await screen.rerender(form(true));
					await whenAllKelvinReady(screen.container);
					const textarea = screen.container.querySelector('kv-text-area');
					if (textarea) {
						const frame = textarea.shadowRoot!.querySelector('.text-area-wrapper')!.getBoundingClientRect();
						expect(frame.left).toBeCloseTo(textarea.closest('[data-schema-form-field]')!.getBoundingClientRect().left, 0);
						expect(frame.right).toBeCloseTo(textarea.getBoundingClientRect().right, 0);
					}
					for (const message of [invalid ? 'Review this connection setting.' : row.schema.description, `Default: ${defaultLabel(row.formData)}`]) {
						const help = Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text')).find(host =>
							Array.isArray(host.helpText) ? host.helpText.includes(message!) : host.helpText === message
						)!;
						expect(help).toBeDefined();
						await expect.poll(() => help.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(message);
						const text = help.shadowRoot!.querySelector('.help-text')!;
						const field = help.closest('[data-schema-form-field]')!;
						const bounds = field.getBoundingClientRect();
						const feedback = text.getBoundingClientRect();
						// The default goes to the inline end when the footer its container query measures is wider than 460px
						const footer = help.closest(`.${fieldStyles.FieldFooter}`)?.getBoundingClientRect();
						if (message?.startsWith('Default:') && footer && footer.width > 460) {
							expect(footer.right - feedback.right).toBeLessThanOrEqual(4);
							rightAligned++;
						} else insets.push(feedback.left - bounds.left);
						expect(feedback.right).toBeLessThanOrEqual(bounds.right);
						expect(feedback.width).toBeGreaterThan(0);
					}
				}
				expect(rightAligned).toBe(width > 460 && row.name !== 'file' ? 2 : 0);
				expect(insets).toEqual(insets.map(() => 0));
			} finally {
				setThemeMode(StyleMode.Night);
			}
		});
	});
});
