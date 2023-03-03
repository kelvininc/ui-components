import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvInputWrapper } from '../input-wrapper';
import { h } from '@stencil/core';
import { EIconName } from '../../icon/icon.types';

describe('KvInputWrapper (unit tests)', () => {
	let page: SpecPage;
	let component: KvInputWrapper;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvInputWrapper],
			template: () => <kv-input-wrapper label="Label" contentVisible={false}></kv-input-wrapper>
		});
		component = page.rootInstance;
	});

	describe('when the component loads', () => {
		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct label', () => {
			expect(component.label).toEqual('Label');
		});

		it('should set the correct icon', () => {
			expect(component.icon).toEqual(EIconName.Edit);
		});

		it('should set the correct contentVisible setting', () => {
			expect(component.contentVisible).toEqual(false);
		});
	});
});
