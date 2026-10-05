import { newE2EPage } from '@stencil/core/testing';
import { MENU_TRIGGER_VARIANTS } from '../../action-menu/test/action-menu.matrix';

describe.each(MENU_TRIGGER_VARIANTS)('C5 popup state: $name', row => {
	it.each([undefined, false, true])('exposes %s on the inner control', async expanded => {
		const page = await newE2EPage();
		await page.setContent(row.html);
		const host = await page.find(row.tag);
		host.setProperty('menuExpanded', expanded);
		await page.waitForChanges();
		const button = await page.$('aria/Topic 1 actions[role="button"]');
		expect(button).not.toBeNull();
		expect(await button.evaluate(control => control.getAttribute('aria-haspopup'))).toBe(expanded === undefined ? null : 'menu');
		expect(await button.evaluate(control => control.getAttribute('aria-expanded'))).toBe(expanded === undefined ? null : String(expanded));
	});

	it('clears menu state without retaining popup semantics', async () => {
		const page = await newE2EPage();
		await page.setContent(row.html);
		const host = await page.find(row.tag);
		host.setProperty('menuExpanded', true);
		await page.waitForChanges();
		const button = await page.$('aria/Topic 1 actions[role="button"]');
		expect(await button.evaluate(control => control.getAttribute('aria-expanded'))).toBe('true');
		host.setProperty('menuExpanded', undefined);
		await page.waitForChanges();
		expect(await button.evaluate(control => control.getAttribute('aria-haspopup'))).toBeNull();
		expect(await button.evaluate(control => control.getAttribute('aria-expanded'))).toBeNull();
	});

	it('sets and clears the inner Tab index while disabled takes precedence', async () => {
		const page = await newE2EPage();
		await page.setContent(row.html);
		const host = await page.find(row.tag);
		const button = await page.$('aria/Topic 1 actions[role="button"]');
		host.setProperty('menuTabIndex', -1);
		await page.waitForChanges();
		expect(await button.evaluate(control => (control as HTMLElement).tabIndex)).toBe(-1);
		host.setProperty('menuTabIndex', undefined);
		await page.waitForChanges();
		expect(await button.evaluate(control => (control as HTMLElement).tabIndex)).toBe(0);
		host.setProperty('disabled', true);
		host.setProperty('menuTabIndex', 0);
		await page.waitForChanges();
		expect(await button.evaluate(control => (control as HTMLElement).tabIndex)).toBe(-1);
	});
});
