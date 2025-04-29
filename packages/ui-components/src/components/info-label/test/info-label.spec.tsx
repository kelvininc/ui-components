import { SpecPage } from '@stencil/core/internal';
import { KvInfoLabel } from '../info-label';
import { newSpecPage } from '@stencil/core/testing';
import { KvTagLetter } from '../../tag-letter/tag-letter';

describe('Info Label (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: `<kv-info-label label-text="Default" />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when renders with description and read more stuffs', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: `<kv-info-label
							label-title="DESCRIPTION"
							description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
							description-height="34"
							description-collapsed-text="Read more"
							description-opened-text="Read less"
							show-text-shadow="true"
						/>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when renders with copy values props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel],
				html: '<kv-info-label label-title="TYPE" description="data-model" copy-value="data-model" />'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when renders with a component', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInfoLabel, KvTagLetter],
				html: '<kv-info-label label-title="DESCRIPTION"><kv-tag-letter label="Test" tag-letter="T" /></kv-info-label>'
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
