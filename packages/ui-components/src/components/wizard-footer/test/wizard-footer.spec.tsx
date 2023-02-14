import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvWizardFooter } from '../wizard-footer';
import { h } from '@stencil/core';
import { ERROR_STEPS, SUCCESS_STEPS } from './wizard-footer.mock';

describe('Wizard Footer (unit tests)', () => {
	let page: SpecPage;

	describe('when using required props', () => {
		describe('and steps dont have errors', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvWizardFooter],
					template: () => <kv-wizard-footer steps={SUCCESS_STEPS} currentStep={1} progressPercentage={50} />
				});
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});

		describe('and steps have errors', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvWizardFooter],
					template: () => <kv-wizard-footer steps={ERROR_STEPS} currentStep={1} progressPercentage={50} hasError />
				});
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});
	});
});
