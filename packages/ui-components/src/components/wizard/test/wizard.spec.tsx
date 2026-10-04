import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { MOCK_STEPS } from './wizard.mock';
import { KvWizard } from '../wizard';
import { EStepState } from '../wizard.types';
import { ACTIVATION_MODIFIERS } from '../../action-button/test/action-button.mock';

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
						active: true,
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
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} currentStepState={{ state: EStepState.Error, error: 'Unable to proceed to the next step' }} />
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
				hasError: false,
				showPrevBtn: true,
				prevEnabled: true,
				showNextBtn: true,
				nextEnabled: false,
				nextTooltip: 'Unable to proceed to the next step',
				showCancelBtn: false,
				cancelEnabled: true,
				showCompleteBtn: false,
				completeEnabled: false,
				completeTooltip: 'Unable to proceed to the next step',
				progressPercentage: 50
			});
		});
	});

	describe('when current step have success state', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={1} currentStepState={{ state: EStepState.Success }} />
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

		describe('and Enter is pressed', () => {
			const pressEnter = ({
				defaultPrevented = false,
				path = [] as EventTarget[],
				...init
			}: { defaultPrevented?: boolean; path?: EventTarget[] } & KeyboardEventInit = {}) => {
				jest.spyOn(comp.goToStep, 'emit');
				const event = { key: 'Enter', defaultPrevented, target: path[0] ?? page.doc.body, composedPath: () => path, preventDefault: jest.fn(), ...init };
				comp.handleKeyDown(event as unknown as KeyboardEvent);
				return event;
			};

			it('should go to the next step', () => {
				pressEnter();

				expect(comp.goToStep.emit).toHaveBeenCalledWith(2);
			});

			it('should ignore an Enter a button inside the step already handled', () => {
				pressEnter({ defaultPrevented: true });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
			});

			it('should ignore an Enter typed into editable text', () => {
				const editor = page.doc.createElement('div');
				Object.defineProperty(editor, 'isContentEditable', { value: true });

				pressEnter({ path: [editor] });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
			});

			it('should ignore an Enter typed into a native textarea', () => {
				pressEnter({ path: [page.doc.createElement('textarea')] });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
			});

			it.each(['button', 'submit', 'reset', 'image'])('should leave Enter to an input of type %s', type => {
				const input = page.doc.createElement('input');
				input.type = type;
				const event = pressEnter({ path: [input] });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('should leave Enter to a details summary', () => {
				const event = pressEnter({ path: [page.doc.createElement('summary')] });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it.each(ACTIVATION_MODIFIERS)('should leave %s + Enter to a page shortcut', modifier => {
				const event = pressEnter({ [modifier]: true });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('should ignore a held Enter', () => {
				const event = pressEnter({ repeat: true });

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('should listen on the document: Enter from a text input advances, from a button it does not', async () => {
				jest.spyOn(comp.goToStep, 'emit');
				const input = page.doc.createElement('input');
				const button = page.doc.createElement('button');
				page.doc.body.append(input, button);

				input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
				expect(comp.goToStep.emit).toHaveBeenCalledTimes(1);

				button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
				expect(comp.goToStep.emit).toHaveBeenCalledTimes(1);
			});

			it('should leave Enter to a focused button even when the key is dispatched elsewhere', () => {
				const button = page.doc.createElement('button');
				page.doc.body.appendChild(button);
				Object.defineProperty(page.doc, 'activeElement', { value: button, configurable: true });
				try {
					pressEnter();
				} finally {
					delete (page.doc as unknown as { activeElement?: Element }).activeElement;
				}

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
			});

			it('should still advance on Enter from a link without href, which is not a link to follow', () => {
				pressEnter({ path: [page.doc.createElement('a')] });

				expect(comp.goToStep.emit).toHaveBeenCalledWith(2);
			});

			it('should leave an Enter on a focused button or link to that control', () => {
				const link = page.doc.createElement('a');
				link.setAttribute('href', '#docs');
				const roleButton = page.doc.createElement('div');
				roleButton.setAttribute('role', 'button');

				[page.doc.createElement('button'), link, roleButton].forEach(control => pressEnter({ path: [control] }));

				expect(comp.goToStep.emit).not.toHaveBeenCalled();
			});
		});
	});

	describe('when current step is the first one', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvWizard],
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={0} currentStepState={{ state: EStepState.Success }} />
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
				template: () => <kv-wizard steps={MOCK_STEPS} currentStep={2} currentStepState={{ state: EStepState.Success }} completeBtnLabel="Deploy" />
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
