import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { FIELD_FEEDBACK_SHAPES } from './test-utils/matrix';

describe.each([StyleMode.Light, StyleMode.Night])('field feedback in %s', theme => {
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
				for (const invalid of [false, true]) {
					if (invalid) await screen.rerender(form(true));
					await whenAllKelvinReady(screen.container);
					const textarea = screen.container.querySelector('kv-text-area');
					if (textarea) {
						const frame = textarea.shadowRoot!.querySelector('.text-area-wrapper')!.getBoundingClientRect();
						expect(frame.left).toBeCloseTo(textarea.closest('[data-schema-form-field]')!.getBoundingClientRect().left, 0);
						expect(frame.right).toBeCloseTo(textarea.getBoundingClientRect().right, 0);
					}
					for (const message of [invalid ? 'Review this connection setting.' : row.schema.description, `Default value is: ${row.formData}`]) {
						const help = Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text')).find(host =>
							Array.isArray(host.helpText) ? host.helpText.includes(message!) : host.helpText === message
						)!;
						expect(help).toBeDefined();
						await expect.poll(() => help.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(message);
						const text = help.shadowRoot!.querySelector('.help-text')!;
						const field = help.closest('[data-schema-form-field]')!;
						const bounds = field.getBoundingClientRect();
						const feedback = text.getBoundingClientRect();
						insets.push(feedback.left - bounds.left);
						expect(feedback.right).toBeLessThanOrEqual(bounds.right);
						expect(feedback.width).toBeGreaterThan(0);
					}
				}
				expect(insets).toEqual([0, 0, 0, 0]);
			} finally {
				setThemeMode(StyleMode.Night);
			}
		});
	});
});
