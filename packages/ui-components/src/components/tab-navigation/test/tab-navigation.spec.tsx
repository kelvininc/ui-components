import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvTabNavigation } from '../tab-navigation';
import { NOTIFICATIONS_MOCK, TAB_ITEMS } from './tab-navigation.mock';
import { h } from '@stencil/core';

describe('Tab Navigation (unit tests)', () => {
	let page: SpecPage;
	let component: KvTabNavigation;

	const tabsMock = cloneDeep(TAB_ITEMS);
	const notificationsMock = cloneDeep(NOTIFICATIONS_MOCK);

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTabNavigation],
				template: () => <kv-tab-navigation selectedTabKey="tab1" tabs={tabsMock}></kv-tab-navigation>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct component tabs', () => {
			expect(component.tabs).toEqual([
				{
					tabKey: 'tab1',
					label: 'Tab 1'
				},
				{
					tabKey: 'tab2',
					label: 'Tab 1'
				},
				{
					tabKey: 'tab3',
					label: 'Tab 1'
				},
				{
					tabKey: 'tab4',
					label: 'Tab 1'
				},
				{
					tabKey: 'tab5',
					label: 'Tab 1'
				}
			]);
		});
	});

	describe('when rendering with required props and notifications', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTabNavigation],
				template: () => <kv-tab-navigation selectedTabKey="tab1" tabs={tabsMock} notifications={notificationsMock}></kv-tab-navigation>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct notifications', () => {
			expect(component.notifications).toEqual({
				tab1: {
					active: true
				}
			});
		});
	});
});
