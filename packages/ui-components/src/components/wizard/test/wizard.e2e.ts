import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { MOCK_STEPS } from './wizard.mock';
import { WIZARD_ENTER_OWNERS } from './wizard-keyboard.mock';
import { EStepState } from '../wizard.types';
import { ACTIVATION_MODIFIERS } from '../../action-button/test/action-button.mock';

async function renderWizard(content: string, currentStep = 0, props: Record<string, unknown> = {}): Promise<E2EPage> {
	const page = await newE2EPage();
	await page.setContent(`<kv-wizard show-header="false" show-step-bar="false" complete-btn-label="Complete"><div slot="step-content">${content}</div></kv-wizard>`);
	const wizard = await page.find('kv-wizard');
	wizard.setProperty('steps', MOCK_STEPS);
	wizard.setProperty('currentStep', currentStep);
	wizard.setProperty('currentStepState', { state: EStepState.Success });
	for (const [name, value] of Object.entries(props)) wizard.setProperty(name, value);
	await page.waitForChanges();
	return page;
}

describe('wizard keyboard ownership', () => {
	it.each(WIZARD_ENTER_OWNERS)('leaves Enter on $name to its control', async row => {
		const page = await renderWizard(row.html);
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		const complete = await wizard.spyOnEvent('completeClick');
		const owner = await page.find('#owner');
		const click = await owner.spyOnEvent('click');
		await page.focus('#owner');
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(goToStep).not.toHaveReceivedEvent();
		expect(complete).not.toHaveReceivedEvent();
		const clicksOnEnter = row.name === 'native button' || row.name.startsWith('input ') || row.name === 'summary' || row.name === 'link';
		expect(click).toHaveReceivedEventTimes(clicksOnEnter ? 1 : 0);
		expect(await page.evaluate(() => document.querySelector('details')?.open)).toBe(row.name === 'summary' ? true : undefined);
	});

	it.each(['button', 'textarea'])('leaves uncanceled Enter to a native %s inside a shadow root', async tag => {
		const page = await renderWizard('<div id="shadow-owner"></div>');
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		const owner = await page.find('#shadow-owner');
		const click = await owner.spyOnEvent('click');
		await page.evaluate(tag => {
			const root = document.querySelector('#shadow-owner').attachShadow({ mode: 'open' });
			root.innerHTML = tag === 'button' ? '<button>Save connection</button>' : '<textarea>Connection notes</textarea>';
			(root.firstElementChild as HTMLElement).focus();
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter') document.body.dataset.prevented = String(event.defaultPrevented);
			});
		}, tag);
		expect(await page.evaluate(() => document.activeElement.id)).toBe('shadow-owner');
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(goToStep).not.toHaveReceivedEvent();
		expect(await page.evaluate(() => document.body.dataset.prevented)).toBe('false');
		expect(click).toHaveReceivedEventTimes(tag === 'button' ? 1 : 0);
		expect(await page.evaluate(() => document.querySelector('#shadow-owner').shadowRoot.querySelector('textarea')?.value.includes('\n'))).toBe(
			tag === 'textarea' ? true : undefined
		);
	});

	it('activates a Stencil button inside a step once without advancing the wizard', async () => {
		const page = await renderWizard('<kv-action-button-text type="primary" text="Save connection"></kv-action-button-text>');
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		const button = await page.find('kv-action-button-text');
		const click = await button.spyOnEvent('clickButton');
		await page.evaluate(() => document.querySelector('kv-action-button-text').focus());
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(click).toHaveReceivedEventTimes(1);
		expect(goToStep).not.toHaveReceivedEvent();
	});

	it.each([
		{ step: 0, name: 'Next', event: 'goToStep' },
		{ step: 2, name: 'Complete', event: 'completeClick' }
	])('activates $name once for a held Enter without submitting the form', async row => {
		const page = await renderWizard('<form id="connector-form"><input id="owner" aria-label="Connector name" /></form>', row.step);
		const wizard = await page.find('kv-wizard');
		const activation = await wizard.spyOnEvent(row.event);
		const form = await page.find('#connector-form');
		const submit = await form.spyOnEvent('submit');
		await page.evaluate(() => document.querySelector('#connector-form').addEventListener('submit', event => event.preventDefault()));
		await page.focus('#owner');
		await page.keyboard.down('Enter');
		await page.keyboard.down('Enter');
		await page.keyboard.up('Enter');
		await page.waitForChanges();

		expect(activation).toHaveReceivedEventTimes(1);
		expect(submit).not.toHaveReceivedEvent();
	});

	it.each(ACTIVATION_MODIFIERS)('leaves %s + Enter from an input to a page shortcut', async modifier => {
		const page = await renderWizard('<input id="owner" aria-label="Connector name" />');
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		await page.evaluate(() =>
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter') document.body.dataset.prevented = String(event.defaultPrevented);
			})
		);
		await page.focus('#owner');
		const key = { altKey: 'Alt', ctrlKey: 'Control', metaKey: 'Meta' }[modifier] as 'Alt' | 'Control' | 'Meta';
		await page.keyboard.down(key);
		await page.keyboard.press('Enter');
		await page.keyboard.up(key);
		await page.waitForChanges();

		expect(goToStep).not.toHaveReceivedEvent();
		expect(await page.evaluate(() => document.body.dataset.prevented)).toBe('false');
	});

	it('honors a canceled Enter from a shadow-root input', async () => {
		const page = await renderWizard('<kv-text-field accessible-label="Connector name"></kv-text-field>');
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		await page.evaluate(async () => {
			const field = document.querySelector('kv-text-field');
			field.shadowRoot.querySelector('input').addEventListener('keydown', event => event.preventDefault());
			await field.focusInput();
		});
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(goToStep).not.toHaveReceivedEvent();
	});

	it.each([
		{ step: 0, name: 'Next', event: 'goToStep' },
		{ step: 2, name: 'Complete', event: 'completeClick' }
	])('activates the $name footer once', async row => {
		const page = await renderWizard('<input aria-label="Connector name" />', row.step);
		const wizard = await page.find('kv-wizard');
		const activation = await wizard.spyOnEvent(row.event);
		const control = await page.$(`aria/${row.name}[role="button"]`);
		expect(control).not.toBeNull();
		await control.focus();
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(activation).toHaveReceivedEventTimes(1);
	});

	it.each(
		[
			{ name: 'disabled', props: { disabled: true } },
			{ name: 'error', props: { currentStepState: { state: EStepState.Error, error: 'Set a broker URL' } } },
			{ name: 'pending', props: { currentStepState: undefined } }
		].flatMap(row => [0, MOCK_STEPS.length - 1].map(step => ({ ...row, step })))
	)('keeps a $name step $step from advancing or completing', async row => {
		const page = await renderWizard('<input id="owner" aria-label="Connector name" />', row.step, row.props);
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		const complete = await wizard.spyOnEvent('completeClick');
		await page.evaluate(() =>
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter') document.body.dataset.prevented = String(event.defaultPrevented);
			})
		);
		await page.focus('#owner');
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(goToStep).not.toHaveReceivedEvent();
		expect(complete).not.toHaveReceivedEvent();
		expect(await page.evaluate(() => document.body.dataset.prevented)).toBe(row.name === 'pending' ? 'true' : 'false');
	});

	it('leaves Enter uncanceled before a footer can initialize', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-wizard><input id="owner" slot="step-content" aria-label="Connector name" /></kv-wizard>');
		const wizard = await page.find('kv-wizard');
		const goToStep = await wizard.spyOnEvent('goToStep');
		const complete = await wizard.spyOnEvent('completeClick');
		const footer = await page.find('kv-wizard >>> kv-wizard-footer');
		expect(await footer.getProperty('steps')).toBeUndefined();
		expect(await footer.getProperty('currentStep')).toBeUndefined();
		await page.evaluate(() =>
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter') document.body.dataset.prevented = String(event.defaultPrevented);
			})
		);
		await page.focus('#owner');
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(goToStep).not.toHaveReceivedEvent();
		expect(complete).not.toHaveReceivedEvent();
		expect(await page.evaluate(() => document.body.dataset.prevented)).toBe('false');
	});
});
