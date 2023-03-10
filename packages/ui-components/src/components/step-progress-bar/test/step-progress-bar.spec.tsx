import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvStepProgressBar } from '../step-progress-bar';

describe('StepProgressBar (unit tests)', () => {
	let page: SpecPage;
	let component: KvStepProgressBar;

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepProgressBar],
				html: `
					<kv-step-progress-bar progress-percentage=50>
						<kv-step-indicator active />
						<kv-step-indicator active />
						<kv-step-indicator />
					</kv-step-progress-bar>
				`
			});
			component = page.rootInstance;
		});

		describe('when the component loads', () => {
			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});

			it('should assign the correct value to the `progressPercentage` prop', () => {
				expect(component.progressPercentage).toEqual(50);
			});
		});
	});

	describe('when rendering with required props and error state', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepProgressBar],
				html: `
					<kv-step-progress-bar progress-percentage=50 has-error>
						<kv-step-indicator active has-error />
						<kv-step-indicator active has-error />
						<kv-step-indicator />
					</kv-step-progress-bar>
				`
			});
			component = page.rootInstance;
		});

		describe('when the component loads', () => {
			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});

			it('should assign the correct value to the `progressPercentage` prop', () => {
				expect(component.progressPercentage).toEqual(50);
			});

			it('should assign the correct value to the `hasError` prop', () => {
				expect(component.hasError).toEqual(true);
			});
		});
	});
});
