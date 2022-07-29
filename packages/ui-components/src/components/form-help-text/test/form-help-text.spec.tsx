import { SpecPage } from '@stencil/core/internal';
import { KvFormHelpText } from '../form-help-text';
import { newSpecPage } from '@stencil/core/testing';

describe('Form Help Text (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormHelpText],
				html: `<kv-form-help-text></kv-form-help-text>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a help text', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormHelpText],
				html: `<kv-form-help-text helpText="Text Field"></kv-form-help-text>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a help text and state is invalid', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormHelpText],
				html: `<kv-form-help-text help-text="Help Text" state="invalid"></kv-form-help-text>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
