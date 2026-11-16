import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { KvDropdown } from '../dropdown';

describe('KvDropdown positioning overrides', () => {
	it('should retain sizing and collision handling when only placement is overridden', async () => {
		const page = await newSpecPage({
			components: [KvDropdown],
			template: () => <kv-dropdown options={{ placement: 'top-start' }} />
		});
		const options = page.root.querySelector('kv-dropdown-base').options;
		expect(options.placement).toBe('top-start');
		expect(options.middleware.map(middleware => middleware && middleware.name)).toEqual(['offset', 'flip', 'size']);
	});

	it('should preserve an explicit middleware override when the consumer supplies one', async () => {
		const page = await newSpecPage({
			components: [KvDropdown],
			template: () => <kv-dropdown options={{ placement: 'top-start', middleware: [] }} />
		});
		const options = page.root.querySelector('kv-dropdown-base').options;
		expect(options.placement).toBe('top-start');
		expect(options.middleware).toEqual([]);
	});
});
