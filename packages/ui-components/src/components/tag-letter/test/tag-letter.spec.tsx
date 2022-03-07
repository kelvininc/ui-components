import { SpecPage } from '@stencil/core/internal';
import { KvTagLetter } from '../tag-letter';
import { newSpecPage } from '@stencil/core/testing';

describe('Tag Letter (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagLetter],
				html: `<kv-tag-letter label="Tag Letter Default"></kv-tag-letter>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a tag letter', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagLetter],
				html: `<kv-tag-letter label="Tag Letter" tag-letter="T"></kv-tag-letter>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
