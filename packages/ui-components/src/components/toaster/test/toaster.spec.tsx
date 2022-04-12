import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvToaster } from '../toaster';
import { EToasterType } from '../toaster.types';

describe('Toaster (unit tests)', () => {
	let page: SpecPage;
	let component: KvToaster;

	describe('when uses default props and error type', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" type="error"></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when toaster is info type', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" type="info"></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('component type should be the type info', () => {
			expect(component.type).toBe(EToasterType.Info);
		});
	});

	describe('when toaster is error type', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" type="error"></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('component type should be the type error', () => {
			expect(component.type).toBe(EToasterType.Error);
		});
	});

	describe('when toaster is success type', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" type="success"></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('component type should be the type success', () => {
			expect(component.type).toBe(EToasterType.Success);
		});
	});

	describe('when toaster is warning type', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" type="warning"></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('component type should be the type warning', () => {
			expect(component.type).toBe(EToasterType.Warning);
		});
	});

	describe('when has a header and a description message', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" description="Secondary Message" type="warning"></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('header message must be Main Message', () => {
			expect(component.header).toBe('Main Message');
		});

		it('description should be Secondary Message', () => {
			expect(component.description).toBe('Secondary Message');
		});
	});

	describe('when a ttl is defined (ttl > 0)', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToaster],
				html: '<kv-toaster header="Main Message" description="Secondary Message" type="warning" ttl=200></kv-toaster>'
			});
			component = page.rootInstance;
		});

		it('ttl must be 200', () => {
			expect(component.ttl).toBe(200);
		});
	});
});
