import { newE2EPage } from '@stencil/core/testing';
import { CLEAR_SELECTION_LABEL, SELECT_ALL_LABEL } from '../select.config';
import { SELECT_LABEL_CONSUMERS, SELECT_LABEL_SHAPES } from './select.labels.matrix';

describe.each(['light', 'night'])('select labels in %s', theme => {
	describe.each(SELECT_LABEL_CONSUMERS)('consumer $tag', consumer => {
		it.each(SELECT_LABEL_SHAPES)('renders $name labels and restores defaults without replacing the select', async row => {
			const page = await newE2EPage();
			await page.setContent(`<${consumer.tag} accessible-label="Topics" selection-all selection-clearable></${consumer.tag}>`);
			await page.addStyleTag({ url: '/assets/styles/style-dictionary/tokens/index.css' });
			await page.evaluate(mode => document.body.setAttribute('mode', mode), theme);
			const host = await page.find(consumer.tag);
			Object.entries(consumer.props).forEach(([key, value]) => host.setProperty(key, value));
			await page.waitForChanges();
			if (consumer.dropdown) {
				await (await page.$('aria/Topics[role="textbox"]')).click();
				await page.waitForChanges();
			}
			const selectPath = consumer.tag === 'kv-select' ? 'kv-select' : 'kv-select-multi-options >>> kv-select';
			const select = await page.$(selectPath);
			const texts = async () => Promise.all((await page.findAll(`${selectPath} >>> kv-action-button-text`)).map(action => action.getProperty('text')));
			Object.entries(row.labels).forEach(([key, value]) => host.setProperty(key, value));
			await page.waitForChanges();
			expect(await texts()).toEqual(row.expected);
			for (const label of row.expected.filter(Boolean)) expect(await page.$(`aria/${label}[role="button"]`)).not.toBeNull();

			host.setProperty('clearSelectionLabel', 'Clear topics');
			host.setProperty('selectAllLabel', 'Select every topic');
			await page.waitForChanges();
			expect(await texts()).toEqual(['Select every topic', 'Clear topics']);
			host.setProperty('clearSelectionLabel', undefined);
			host.setProperty('selectAllLabel', undefined);
			await page.waitForChanges();
			expect(await texts()).toEqual([SELECT_ALL_LABEL, CLEAR_SELECTION_LABEL]);
			expect(await select.evaluate(element => element.isConnected)).toBe(true);
			expect(await page.$(`aria/${SELECT_ALL_LABEL}[role="button"]`)).not.toBeNull();
			expect(await page.$(`aria/${CLEAR_SELECTION_LABEL}[role="button"]`)).not.toBeNull();
		});
	});
});

it('retains the direct select action events and disabled states with default labels', async () => {
	const page = await newE2EPage({ html: '<kv-select selection-all selection-all-enabled selection-clearable selection-clear-enabled></kv-select>' });
	const host = await page.find('kv-select');
	const selected = await host.spyOnEvent('selectAll');
	const cleared = await host.spyOnEvent('clearSelection');
	host.setProperty('clearSelectionLabel', undefined);
	host.setProperty('selectAllLabel', undefined);
	await page.waitForChanges();
	await (await page.$(`aria/${SELECT_ALL_LABEL}[role="button"]`)).click();
	await (await page.$(`aria/${CLEAR_SELECTION_LABEL}[role="button"]`)).click();
	await page.waitForChanges();
	expect(selected).toHaveReceivedEventTimes(1);
	expect(cleared).toHaveReceivedEventTimes(1);
	host.setProperty('selectionAllEnabled', false);
	host.setProperty('selectionClearEnabled', false);
	await page.waitForChanges();
	for (const label of [SELECT_ALL_LABEL, CLEAR_SELECTION_LABEL]) {
		const button = await page.$(`aria/${label}[role="button"]`);
		expect(await button.evaluate(element => element.getAttribute('aria-disabled'))).toBe('true');
		await button.click();
	}
	await page.waitForChanges();
	expect(selected).toHaveReceivedEventTimes(1);
	expect(cleared).toHaveReceivedEventTimes(1);
});
