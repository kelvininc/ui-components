import { SpecPage } from '@stencil/core/internal';
import { KvTextField } from '../text-field';
import { KvTooltip } from '../../tooltip/tooltip';
import { newSpecPage } from '@stencil/core/testing';

describe('Text Field (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextField],
				html: `<kv-text-field></kv-text-field>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('value prefix', () => {
		const render = async (attributes: string) => {
			page = await newSpecPage({
				components: [KvTextField, KvTooltip],
				html: `<kv-text-field value-prefix="Polling rate (in seconds):" ${attributes}></kv-text-field>`
			});

			return page.root?.shadowRoot?.querySelector('.value-prefix');
		};

		it('is shown beside a value', async () => {
			const prefix = await render('value="30"');

			expect(prefix?.textContent).toBe('Polling rate (in seconds):');
			// Inside a tooltip that opens only when the prefix is cut
			const tooltip = prefix?.closest('kv-tooltip');
			expect(tooltip?.getAttribute('text')).toBe('Polling rate (in seconds):');
			expect((tooltip as HTMLKvTooltipElement).truncate).toBe(true);
			expect(page.root?.shadowRoot?.querySelector('.left-slot-container')).toHaveClass('has-value-prefix');
		});

		it('is hidden while the field is empty, by default', async () => {
			expect(await render('')).toBeNull();
		});

		it('is shown while the field is empty with prefix-when-empty', async () => {
			const prefix = await render('prefix-when-empty placeholder="Mixed"');

			expect(prefix?.textContent).toBe('Polling rate (in seconds):');
			expect(page.root?.shadowRoot?.querySelector('input')?.getAttribute('placeholder')).toBe('Mixed');
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextField],
				html: `<kv-text-field label="Text Field"></kv-text-field>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextField],
				html: `<kv-text-field input-disabled></kv-text-field>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
