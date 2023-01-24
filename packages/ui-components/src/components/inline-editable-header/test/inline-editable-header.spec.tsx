import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvInlineEditableHeader } from '../inline-editable-header';

describe('InlineEditableHeader (end-to-end)', () => {
	let page: SpecPage;

	describe('when rendering with a value', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInlineEditableHeader],
				html: `<kv-inline-editable-header value="Hello"></kv-inline-editable-header>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when rendering with a value in edit mode', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInlineEditableHeader],
				html: `<kv-inline-editable-header value="Hello" is-editing></kv-inline-editable-header>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when rendering with a value that is invalid', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInlineEditableHeader],
				html: `<kv-inline-editable-header value="Hello" is-editing state='invalid' help-text="It is invalid"></kv-inline-editable-header>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
