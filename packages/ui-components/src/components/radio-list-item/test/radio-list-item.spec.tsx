import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvRadioListItem } from '../radio-list-item';

describe('Radio List Item (unit tests)', () => {
	let page: SpecPage;

	describe('when passing required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and a description', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' description='Check the [documentation](https://docs.kelvininc.com/4.10.2/) here.' />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and `checked` true', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' checked=true />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when passing required props and `disabled` true', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioListItem],
				html: `<kv-radio-list-item option-id='k3s' label='K3S' disabled=true />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
