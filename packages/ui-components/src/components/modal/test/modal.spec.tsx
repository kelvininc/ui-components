import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvModal } from '../modal';

describe('Modal (unit tests)', () => {
	let page: SpecPage;
	let component: KvModal;

	describe('when the component loads with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvModal],
				html: `<kv-modal modal-title="Modal Test">
					<div className="header">This is a modal header</div>
					<div className="body">This is a modal body</div>
					<div className="footer">This is a modal footer</div>
				</kv-modal>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `title` with string', () => {
			expect(component.modalTitle).toBeTruthy();
		});
	});
});
