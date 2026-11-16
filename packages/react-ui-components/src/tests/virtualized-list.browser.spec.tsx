import React from 'react';
import { expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { KvVirtualizedList } from '../stencil-generated';
import { whenKelvinReady } from '../test-utils/browser';

it('should fully reveal a requested row when the virtualized list has default padding', async () => {
	const screen = await render(
		<KvVirtualizedList style={{ height: '120px', width: '240px' }} itemCount={60} itemHeight={32} getItemKey={String} renderItem={index => `Row ${index}`} />
	);
	const list = await whenKelvinReady(screen.container.querySelector('kv-virtualized-list')!);
	const viewport = list.shadowRoot!.querySelector<HTMLElement>('.container')!;
	expect(parseFloat(getComputedStyle(viewport).paddingTop)).toBeGreaterThan(0);
	await expect.poll(() => viewport.clientHeight).toBeGreaterThan(0);
	await expect.poll(() => viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);

	for (const index of [25, 2, 59, 0]) {
		await list.scrollToIndex(index);
		const row = page.getByText(`Row ${index}`, { exact: true });
		await expect.element(row).toBeVisible();
		await expect.poll(() => row.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(viewport.getBoundingClientRect().bottom);
		expect(row.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(viewport.getBoundingClientRect().top);
	}
});
