import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvWizardHeader } from '../wizard-header';

describe('WizardHeader (unit tests)', () => {
	let page: SpecPage;
	let comp: KvWizardHeader;

	describe('when rendering with defaults', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizardHeader],
				html: `<kv-wizard-header label="Step 1" description="Choose an application" />`
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
	});
});
