import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import { userEvent } from 'vitest/browser';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvSchemaForm } from '../../SchemaForm';
import { R6_FILE_LAYOUT_SHAPES } from '../../test-utils/matrix';
import styles from './FileWidget.module.scss';

afterEach(() => setThemeMode(StyleMode.Night));

describe.each([380, 800])('file action layout at %ipx', width => {
	describe.each([StyleMode.Light, StyleMode.Night])('in %s mode', mode => {
		it.each(R6_FILE_LAYOUT_SHAPES)('places Browse below full-width files: $name', async row => {
			setThemeMode(mode);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown> {...row} displayErrors showErrorList={false} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const widget = screen.container.querySelector<HTMLElement>(`.${styles.FileWidgetContainer}`)!;
			const files = screen.container.querySelector<HTMLElement>(`.${styles.FilesInfo}`)!;
			const cards = Array.from(files.querySelectorAll(`.${styles.FileInfo}`));
			const browse = screen.getByRole('button', { name: row.browseName, exact: true }).element();
			const text = widget.querySelector('kv-action-button-text')!.shadowRoot!.querySelector('[part="button-text"]')!;
			const filesBounds = files.getBoundingClientRect();
			expect(cards).toHaveLength(Math.max(1, row.values.length));
			if (row.extraErrors) await expect.element(screen.getByText('Client certificate expired.', { exact: true })).toBeVisible();
			expect(browse.getBoundingClientRect().top - filesBounds.bottom).toBeCloseTo(16, 0);
			expect(browse.getBoundingClientRect().left).toBeCloseTo(cards[0].getBoundingClientRect().left, 0);
			// The button keeps its transparent 1px border; its text aligns within that inset.
			expect(Math.abs(text.getBoundingClientRect().left - cards[0].getBoundingClientRect().left)).toBeLessThanOrEqual(1);
			for (const card of cards) expect(card.getBoundingClientRect().width).toBeCloseTo(filesBounds.width, 0);
			expect(widget.scrollWidth).toBeLessThanOrEqual(widget.clientWidth);
		});
	});

	it('tabs through both rows before Browse and the next controls', async () => {
		const row = R6_FILE_LAYOUT_SHAPES.find(row => row.name === 'multiple files')!;
		const screen = await render(
			<div style={{ width }}>
				<button>Before files</button>
				<KvSchemaForm<unknown> {...row} />
				<button>After files</button>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('button', { name: 'Before files', exact: true }).click();
		for (const [name, index] of [
			['Download ca.pem', 0],
			['Remove ca.pem', 0],
			['Download ca.pem', 1],
			['Remove ca.pem', 1],
			['Browse File for Certificates', 0],
			['Submit', 0],
			['After files', 0]
		] as const) {
			await userEvent.tab();
			expect(screen.getByRole('button', { name, exact: true }).nth(index).element().matches(':focus')).toBe(true);
		}
	});
});
