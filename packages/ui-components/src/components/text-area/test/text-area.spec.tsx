import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvTextArea } from '../text-area';

describe('Text Area (unit tests)', () => {
	let page: SpecPage;

	describe('when initialized with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when initialized with icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area icon="kv-notes" max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when initialized with text', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area text="Hello World" max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when initialized with text and placeholder', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area text="Hello World" placeholder="Add Description" max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
