import { SpecPage } from '@stencil/core/internal';
import { KvTagStatus } from '../tag-status';
import { newSpecPage } from '@stencil/core/testing';
import { ETagState } from '../tag-status.types';
import { EIconName } from '../../icon/icon.types';

describe('Status Tag (unit tests)', () => {
	let page: SpecPage;
	let component: KvTagStatus;

	describe('when uses state error and icon error', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagStatus],
				html: `<kv-tag-status state="error" icon="kv-error" label="Error"></kv-tag-status>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should have state error', () => {
			expect(component.state).toBe(ETagState.Error);
		});

		it('should have icon error', () => {
			expect(component.icon).toBe(EIconName.Error);
		});

		it('should have label with text Error', () => {
			expect(component.label).toBe('Error');
		});
	});
});
