import { SpecPage } from '@stencil/core/internal';
import { KvFormLabel } from '../form-label';
import { newSpecPage } from '@stencil/core/testing';

it('keeps the required asterisk out of the accessible label', async () => {
	const page = await newSpecPage({ components: [KvFormLabel], html: '<kv-form-label label="Topics" required />' });
	expect(page.root.shadowRoot.querySelector('.required').getAttribute('aria-hidden')).toBe('true');
});

it.each(['Port name', 'Power * primary'])('places the decorative required marker after %s', async label => {
	const page = await newSpecPage({ components: [KvFormLabel], html: `<kv-form-label label="${label}" required />` });
	const children = page.root.shadowRoot.querySelector('.label-container').children;
	expect(Array.from(children).map(child => child.className)).toEqual(['label', 'required']);
	expect(children[0].textContent).toBe(label);
	expect(children[1].getAttribute('aria-hidden')).toBe('true');
});

it('updates the suffix when required changes', async () => {
	const page = await newSpecPage({ components: [KvFormLabel], html: '<kv-form-label label="Port name" required />' });
	page.root.required = false;
	await page.waitForChanges();
	expect(page.root.shadowRoot.querySelector('.required')).toBeNull();
	page.root.required = true;
	await page.waitForChanges();
	expect(page.root.shadowRoot.querySelectorAll('.required')).toHaveLength(1);
	expect(page.root.shadowRoot.querySelector('.required').previousElementSibling.className).toBe('label');
});

it.each([undefined, '', '   '])('keeps an invalid label %s free of an orphan marker', async label => {
	const page = await newSpecPage({ components: [KvFormLabel], html: '<kv-form-label required />' });
	page.root.label = label;
	await page.waitForChanges();
	expect(page.root.shadowRoot.querySelector('.label-container')).toBeNull();
});

describe('Form Label (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormLabel],
				html: `<kv-form-label></kv-form-label>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormLabel],
				html: `<kv-form-label label="Text Field"></kv-form-label>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is labeled and required', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormLabel],
				html: `<kv-form-label label="Text Field" required></kv-form-label>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
