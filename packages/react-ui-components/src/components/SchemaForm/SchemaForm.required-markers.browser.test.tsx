import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { REQUIRED_MARKER_SHAPES } from './test-utils/matrix';
import styles from './Templates/TitleFieldTemplate/TitleFieldTemplate.module.scss';

afterEach(() => setThemeMode(StyleMode.Night));

describe.each(REQUIRED_MARKER_SHAPES)('real required markers: $name', row => {
	it.each(['editable', 'readonly', 'disabled'])('retains visibility in %s mode', async mode => {
		const screen = await render(
			<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} readonly={mode === 'readonly'} disabled={mode === 'disabled'} />
		);
		await whenAllKelvinReady(screen.container);
		const markers = Array.from(screen.container.querySelectorAll(`.${styles.Required}`));
		expect(
			markers.map(marker => {
				const title = marker.parentElement!.querySelector<HTMLElement>('[id$="-title"]')!;
				return title.tagName === 'KV-TOOLTIP' ? (title as HTMLKvTooltipElement).text : title.textContent;
			})
		).toEqual(row.expectedTitles);
		for (const marker of markers) {
			await expect.element(marker).toBeVisible();
			expect(marker.previousElementSibling!.matches('kv-tooltip,h2,h3,h4,h5,h6')).toBe(true);
			expect(marker.getAttribute('aria-hidden')).toBeNull();
		}
	});
});

const geometryRows = REQUIRED_MARKER_SHAPES.filter(row => ['text; required', 'scalar list; required', 'long control title', 'long array heading'].includes(row.name));
describe.each([StyleMode.Light, StyleMode.Night])('required marker geometry in %s', theme => {
	describe.each(['ltr', 'rtl'] as const)('direction=%s', direction => {
		describe.each([320, 800])('width=%i', width => {
			it.each(geometryRows)('keeps a required suffix beside the displayed title without overlap: $name', async row => {
				setThemeMode(theme);
				const screen = await render(
					<div dir={direction} style={{ width }}>
						<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />
					</div>
				);
				await whenAllKelvinReady(screen.container);
				await document.fonts.ready;
				const marker = screen.container.querySelector<HTMLElement>(`.${styles.Required}`)!;
				const title = marker.previousElementSibling as HTMLElement;
				const help = marker.nextElementSibling as HTMLElement;
				const text = title.tagName === 'KV-TOOLTIP' ? title.querySelector('kv-info-label')!.shadowRoot!.querySelector<HTMLElement>('[part="title"]')! : title;
				const range = document.createRange();
				range.selectNodeContents(text);
				const titleBox = row.name.startsWith('long') ? title.getBoundingClientRect() : range.getBoundingClientRect();
				const markerBox = marker.getBoundingClientRect();
				const helpBox = help.getBoundingClientRect();
				const ownerBox = marker.parentElement!.getBoundingClientRect();
				const suffixGap = direction === 'ltr' ? markerBox.left - titleBox.right : titleBox.left - markerBox.right;
				const helpGap = direction === 'ltr' ? helpBox.left - markerBox.right : markerBox.left - helpBox.right;
				expect(Math.abs(suffixGap - 4)).toBeLessThanOrEqual(1);
				expect(Math.abs(helpGap - 8)).toBeLessThanOrEqual(1);
				for (const box of [title.getBoundingClientRect(), markerBox, helpBox]) {
					expect(box.width).toBeGreaterThan(0);
					expect(box.left).toBeGreaterThanOrEqual(ownerBox.left - 1);
					expect(box.right).toBeLessThanOrEqual(ownerBox.right + 1);
				}
				if (row.name === 'long control title') {
					expect(getComputedStyle(text).textOverflow).toBe('ellipsis');
					if (width === 320) expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
				}
				if (row.name === 'long array heading' && width === 320)
					expect(title.getBoundingClientRect().height).toBeGreaterThan(parseFloat(getComputedStyle(title).lineHeight));
				const probe = document.createElement('span');
				probe.style.color = 'var(--input-text-required-default)';
				marker.parentElement!.append(probe);
				expect(getComputedStyle(marker).color).toBe(getComputedStyle(probe).color);
				probe.remove();
			});
		});
	});
});

it('keeps accessible names and Tab order when a required title has help', async () => {
	const row = REQUIRED_MARKER_SHAPES[0];
	const screen = await render(
		<>
			<button>Before labels</button>
			<KvSchemaForm<unknown> schema={row.schema} uiSchema={{ ...row.uiSchema, 'ui:submitButtonOptions': { norender: true } }} formData={row.formData} />
			<button>After labels</button>
		</>
	);
	await whenAllKelvinReady(screen.container);
	const control = screen.getByRole('textbox', { name: 'Port name', exact: true });
	await expect.element(control).not.toHaveAttribute('required');
	const help = screen.getByRole('button', { name: 'Help for Port name', exact: true });
	await screen.getByRole('button', { name: 'Before labels', exact: true }).click();
	// The title's help is a named button in the Tab order, ahead of the control it describes
	await userEvent.tab();
	await expect.poll(() => help.element().matches(':focus')).toBe(true);
	await userEvent.tab();
	await expect.poll(() => control.element().matches(':focus')).toBe(true);
	await userEvent.tab();
	await expect.element(screen.getByRole('button', { name: 'After labels', exact: true })).toHaveFocus();
});

it('preserves the radio group required state and name', async () => {
	const row = REQUIRED_MARKER_SHAPES.find(row => row.name === 'radio; required')!;
	const screen = await render(<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />);
	await whenAllKelvinReady(screen.container);
	await expect.element(screen.getByRole('radiogroup', { name: 'Delivery policy', exact: true })).toHaveAttribute('aria-required', 'true');
});
