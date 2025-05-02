import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Tree Item (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with label prop', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tree-item label="Label" has-children="true"></kv-tree-item>');
		});

		it('should render a label', async () => {
			const labelEl = await page.find('kv-tree-item >>> .title-small');
			expect(labelEl.innerText).toContain('Label');
		});

		describe('and the user clicks on the node', () => {
			let treeClickSpy: EventSpy;
			let nodeEl: E2EElement;

			beforeEach(async () => {
				nodeEl = await page.find('kv-tree-item');
				treeClickSpy = await nodeEl.spyOnEvent('itemClick');

				const nodeContainerEl = await page.find('kv-tree-item >>> .node-content-wrapper');
				await nodeContainerEl.click();

				await new Promise(r => setTimeout(r, 300));
			});

			it(`should emit the event`, () => {
				expect(treeClickSpy).toHaveReceivedEvent();
			});
		});

		describe('and the user clicks on the expand toggle', () => {
			let toggleClickSpy: EventSpy;
			let nodeEl: E2EElement;

			beforeEach(async () => {
				nodeEl = await page.find('kv-tree-item');
				toggleClickSpy = await nodeEl.spyOnEvent('toggleExpand');

				const arrowContainerEl = await page.find('kv-tree-item >>> .expander-arrow');
				await arrowContainerEl.click();

				await new Promise(r => setTimeout(r, 300));
			});

			it(`should emit the event`, () => {
				expect(toggleClickSpy).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with disabled attribute', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tree-item label="title" has-children="true" disabled></kv-tree-item>');
		});

		describe('and the user clicks on the node', () => {
			let treeClickSpy: EventSpy;
			let nodeEl: E2EElement;

			beforeEach(async () => {
				nodeEl = await page.find('kv-tree-item');
				treeClickSpy = await nodeEl.spyOnEvent('itemClick');

				const nodeContainerEl = await page.find('kv-tree-item >>> .node-content-wrapper');
				await nodeContainerEl.click();

				await new Promise(r => setTimeout(r, 300));
			});

			it(`shouldn't emit the event`, () => {
				expect(treeClickSpy).not.toHaveReceivedEvent();
			});
		});

		describe('and the user clicks on the expand toggle', () => {
			let toggleClickSpy: EventSpy;
			let nodeEl: E2EElement;

			beforeEach(async () => {
				nodeEl = await page.find('kv-tree-item');
				toggleClickSpy = await nodeEl.spyOnEvent('toggleExpand');

				const arrowContainerEl = await page.find('kv-tree-item >>> .expander-arrow');
				await arrowContainerEl.click();

				await new Promise(r => setTimeout(r, 300));
			});

			it(`should emit the event`, () => {
				expect(toggleClickSpy).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with child', () => {
		describe('and parent is expanded', () => {
			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent(`
					<kv-tree-item label="parent" expanded="true">
						<kv-tree-item label="child"></kv-tree-item>
					</kv-tree-item>
				`);
			});

			it('should render the parent and child', async () => {
				const nodesEl = await page.findAll('kv-tree-item');
				expect(nodesEl.length).toBe(2);
			});
		});
	});
});
