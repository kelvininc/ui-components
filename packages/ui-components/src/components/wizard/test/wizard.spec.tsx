import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { MOCK_STEPS } from './wizard.mock';
import { KvWizard } from '../wizard';
import { EStepState } from '../wizard.types';

describe('Wizard (unit tests)', () => {
	let page: SpecPage;
	let comp: KvWizard;

	describe("when current step don't have state", () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize the header props with the correct value', () => {
			expect(comp.currentHeader).toEqual({
				label: 'Step 2',
				description: 'Configuration'
			});
		});

		it('should initialize the footer props with the correct value', () => {
			expect(comp.currentFooter).toEqual({
				steps: [
					{
						stepKey: 'Info',
						enabled: true,
						active: true,
						hasError: false
					},
					{
						stepKey: 'Configuration',
						enabled: false,
						active: false,
						hasError: false
					},
					{
						stepKey: 'Confirmation',
						enabled: false,
						active: false,
						hasError: false
					}
				],
				currentStep: 1,
				hasError: false,
				showPrevBtn: true,
				prevEnabled: true,
				showNextBtn: true,
				nextEnabled: false,
				showCancelBtn: false,
				cancelEnabled: true,
				showCompleteBtn: false,
				completeEnabled: false,
				progressPercentage: 50
			});
		});
	});

	describe('when current step have errors', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} currentStepState={EStepState.Error} />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize the header props with the correct value', () => {
			expect(comp.currentHeader).toEqual({
				label: 'Step 2',
				description: 'Configuration'
			});
		});

		it('should initialize the footer props with the correct value', () => {
			expect(comp.currentFooter).toEqual({
				steps: [
					{
						stepKey: 'Info',
						enabled: true,
						active: true,
						hasError: true
					},
					{
						stepKey: 'Configuration',
						enabled: false,
						active: true,
						hasError: true
					},
					{
						stepKey: 'Confirmation',
						enabled: false,
						active: false,
						hasError: false
					}
				],
				currentStep: 1,
				hasError: true,
				showPrevBtn: true,
				prevEnabled: true,
				showNextBtn: true,
				nextEnabled: false,
				showCancelBtn: false,
				cancelEnabled: true,
				showCompleteBtn: false,
				completeEnabled: false,
				progressPercentage: 50
			});
		});
	});

	describe('when current step have success state', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} currentStepState={EStepState.Success} />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize the header props with the correct value', () => {
			expect(comp.currentHeader).toEqual({
				label: 'Step 2',
				description: 'Configuration'
			});
		});

		it('should initialize the footer props with the correct value', () => {
			expect(comp.currentFooter).toEqual({
				steps: [
					{
						stepKey: 'Info',
						enabled: true,
						active: true,
						hasError: false
					},
					{
						stepKey: 'Configuration',
						enabled: false,
						active: true,
						hasError: false
					},
					{
						stepKey: 'Confirmation',
						enabled: true,
						active: false,
						hasError: false
					}
				],
				currentStep: 1,
				hasError: false,
				showPrevBtn: true,
				prevEnabled: true,
				showNextBtn: true,
				nextEnabled: true,
				showCancelBtn: false,
				cancelEnabled: true,
				showCompleteBtn: false,
				completeEnabled: true,
				progressPercentage: 50
			});
		});

		describe('and step 2 is clicked on step bar', () => {
			beforeEach(() => {
				jest.spyOn(comp.goToStep, 'emit');
				comp.onStepClick({ detail: 2 } as CustomEvent<number>);
			});

			it('should emit to goToStep 2', () => {
				expect(comp.goToStep.emit).toHaveBeenCalledWith(2);
			});
		});

		describe('and previous button is clicked', () => {
			beforeEach(() => {
				jest.spyOn(comp.goToStep, 'emit');
				comp.onPrevClick();
			});

			it('should emit to goToStep 1', () => {
				expect(comp.goToStep.emit).toHaveBeenCalledWith(0);
			});
		});

		describe('and next button is clicked', () => {
			beforeEach(() => {
				jest.spyOn(comp.goToStep, 'emit');
				comp.onNextClick();
			});

			it('should emit to goToStep 1', () => {
				expect(comp.goToStep.emit).toHaveBeenCalledWith(2);
			});
		});
	});

	describe('when current step is the first one', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={0} currentStepState={EStepState.Success} />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize the header props with the correct value', () => {
			expect(comp.currentHeader).toEqual({
				label: 'Step 1',
				description: 'Info'
			});
		});

		it('should initialize the footer props with the correct value', () => {
			expect(comp.currentFooter).toEqual({
				steps: [
					{
						stepKey: 'Info',
						enabled: false,
						active: true,
						hasError: false
					},
					{
						stepKey: 'Configuration',
						enabled: true,
						active: false,
						hasError: false
					},
					{
						stepKey: 'Confirmation',
						enabled: false,
						active: false,
						hasError: false
					}
				],
				currentStep: 0,
				hasError: false,
				showPrevBtn: false,
				prevEnabled: false,
				showNextBtn: true,
				nextEnabled: true,
				showCancelBtn: true,
				cancelEnabled: true,
				showCompleteBtn: false,
				completeEnabled: true,
				progressPercentage: 0
			});
		});
	});

	describe('when current step is the last one', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={2} currentStepState={EStepState.Success} completeBtnLabel="Deploy" />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize the header props with the correct value', () => {
			expect(comp.currentHeader).toEqual({
				label: 'Step 3',
				description: 'Confirmation'
			});
		});

		it('should initialize the footer props with the correct value', () => {
			expect(comp.currentFooter).toEqual({
				steps: [
					{
						stepKey: 'Info',
						enabled: true,
						active: true,
						hasError: false
					},
					{
						stepKey: 'Configuration',
						enabled: true,
						active: true,
						hasError: false
					},
					{
						stepKey: 'Confirmation',
						enabled: false,
						active: true,
						hasError: false
					}
				],
				currentStep: 2,
				hasError: false,
				showPrevBtn: true,
				prevEnabled: true,
				showNextBtn: false,
				nextEnabled: true,
				showCancelBtn: false,
				cancelEnabled: true,
				showCompleteBtn: true,
				completeEnabled: true,
				progressPercentage: 100
			});
		});

		describe('and previous button is clicked', () => {
			beforeEach(() => {
				jest.spyOn(comp.goToStep, 'emit');
				comp.onPrevClick();
			});

			it('should emit to goToStep 1', () => {
				expect(comp.goToStep.emit).toHaveBeenCalledWith(1);
			});
		});
	});

	describe('when showHeader is false', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} showHeader={false} />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when showStepBar is false', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} showStepBar={false} />
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
