import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvSelectCreateOption } from '../select-create-option';
import { KvTextField } from '../../text-field/text-field';
import { KvActionButtonIcon } from '../../action-button-icon/action-button-icon';
import { KvActionButton } from '../../action-button/action-button';

describe('Select Create Option (unit tests)', () => {
	let page: SpecPage;

	describe('accessibility', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSelectCreateOption, KvTextField, KvActionButtonIcon, KvActionButton],
				html: '<kv-select-create-option value="Compressor"></kv-select-create-option>'
			});
		});

		it.each([
			['cancel-button', 'Cancel'],
			['create-button', 'Create option']
		])('names the icon-only %s "%s"', (part, name) => {
			const action = page.root?.querySelector(`[part="${part}"]`);
			const button = action?.shadowRoot?.querySelector('kv-action-button')?.shadowRoot?.querySelector('[part="button"]');

			expect(button?.getAttribute('role')).toBe('button');
			expect(button?.getAttribute('aria-label')).toBe(name);
		});
	});
});
