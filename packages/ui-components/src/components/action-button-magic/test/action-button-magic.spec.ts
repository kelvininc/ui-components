import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvActionButtonMagic } from '../action-button-magic';
import { KvActionButtonIcon } from '../../action-button-icon/action-button-icon';
import { KvActionButtonText } from '../../action-button-text/action-button-text';
import { KvActionButton } from '../../action-button/action-button';

describe('Action Button Magic (unit tests)', () => {
	let page: SpecPage;
	const innerButton = () => {
		const variant = page.root?.shadowRoot?.querySelector('kv-action-button-icon, kv-action-button-text');
		return variant?.shadowRoot?.querySelector('kv-action-button')?.shadowRoot?.querySelector('[part="button"]');
	};

	describe('when it has a label', () => {
		it('should name the inner button with it when it shows only an icon', async () => {
			page = await newSpecPage({
				components: [KvActionButtonMagic, KvActionButtonIcon, KvActionButtonText, KvActionButton],
				html: '<kv-action-button-magic type="tertiary" icon="kv-close" accessible-label="Close"></kv-action-button-magic>'
			});

			expect(innerButton()?.getAttribute('aria-label')).toBe('Close');
		});

		it('should name the inner button with it when it shows text', async () => {
			page = await newSpecPage({
				components: [KvActionButtonMagic, KvActionButtonIcon, KvActionButtonText, KvActionButton],
				html: '<kv-action-button-magic type="primary" icon="kv-add" text="Add" accessible-label="Add asset"></kv-action-button-magic>'
			});

			expect(innerButton()?.getAttribute('aria-label')).toBe('Add asset');
		});
	});
});
