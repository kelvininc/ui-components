import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { STEPS_ERROR_MOCK, STEPS_SUCCESS_MOCK } from './step-bar.mock';
import { KvStepBar } from '../step-bar';

describe('KvStepBar (unit tests)', () => {
	let page: SpecPage;
	let component: KvStepBar;

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepBar],
				template: () => <kv-step-bar steps={STEPS_SUCCESS_MOCK} currentStep={1} progressPercentage={50}></kv-step-bar>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct steps array', () => {
			expect(component.steps).toEqual([
				{
					enabled: true,
					active: true
				},
				{
					enabled: true,
					active: true
				},
				{
					enabled: false
				}
			]);
		});
	});

	describe('when rendering with required props and `hasError` true', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepBar],
				template: () => <kv-step-bar steps={STEPS_ERROR_MOCK} currentStep={1} progressPercentage={50}></kv-step-bar>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct steps array', () => {
			expect(component.steps).toEqual([
				{
					enabled: true,
					active: true,
					hasError: true
				},
				{
					enabled: true,
					active: true,
					hasError: true
				},
				{
					enabled: false
				}
			]);
		});
	});
});
