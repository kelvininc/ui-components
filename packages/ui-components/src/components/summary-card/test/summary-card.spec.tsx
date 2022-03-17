import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvSummaryCard } from '../summary-card';
import { ESummaryCardType } from '../summary-card.types';
import { h } from '@stencil/core';

describe('KvSummaryCard (unit tests)', () => {
	let page: SpecPage;
	let component: KvSummaryCard;

	describe('when initialized with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSummaryCard],
				template: () => <kv-summary-card type={ESummaryCardType.Text}></kv-summary-card>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct value for type prop', () => {
			expect(component.type).toEqual(ESummaryCardType.Text);
		});

		it('should set the correct value for loading prop', () => {
			expect(component.loading).toBeFalsy();
		});

		it('should set the correct value for label internal state', () => {
			expect(component._label).toEqual('- -');
		});
	});

	describe('when initialized with loading flag', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSummaryCard],
				template: () => <kv-summary-card type={ESummaryCardType.Text} loading></kv-summary-card>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct value for loading prop', () => {
			expect(component.loading).toBeTruthy();
		});
	});

	describe('when initialized with label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSummaryCard],
				template: () => <kv-summary-card type={ESummaryCardType.Text} label="Kelvin"></kv-summary-card>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct value for label internal state', () => {
			expect(component._label).toEqual('Kelvin');
		});
	});

	describe('when initialized with subtitle', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSummaryCard],
				template: () => <kv-summary-card type={ESummaryCardType.Text} subtitle="MCF/ Day"></kv-summary-card>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct value for subtitle prop', () => {
			expect(component.subtitle).toEqual('MCF/ Day');
		});
	});

	describe('when initialized with description', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSummaryCard],
				template: () => <kv-summary-card type={ESummaryCardType.Text} description="Gas Flow"></kv-summary-card>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct value for description prop', () => {
			expect(component.description).toEqual('Gas Flow');
		});
	});
});
