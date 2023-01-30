import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvTutorialHeader } from '../tutorial-header';

describe('TutorialHeader (unit tests)', () => {
	let page: SpecPage;
	let comp: KvTutorialHeader;

	describe('when rendering with defaults', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTutorialHeader],
				html: `<kv-tutorial-header label="Step 1" description="Choose an application" />`
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should have the correct label assigned', () => {
			expect(comp.label).toEqual('Step 1');
		});

		it('should have the correct description assigned', () => {
			expect(comp.description).toEqual('Choose an application');
		});

		it('should have the default separator assigned', () => {
			expect(comp.separator).toEqual('-');
		});
	});

	describe('when rendering with a different separator', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTutorialHeader],
				html: `<kv-tutorial-header label="Step 1" description="Choose an application" separator="⬤" />`
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should have the correct separator', () => {
			expect(comp.separator).toEqual('⬤');
		});
	});
});
