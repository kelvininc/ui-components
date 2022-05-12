import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvTree } from '../tree';
import { NODES } from './tree.mock';
import { h } from '@stencil/core';

describe('Tree (unit tests)', () => {
	let page: SpecPage;
	let component: KvTree;

	const nodesMock = cloneDeep(NODES);

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTree],
				template: () => <kv-tree nodes={nodesMock}></kv-tree>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct component nodes', () => {
			expect(component.nodes).toEqual(NODES);
		});
	});
});
