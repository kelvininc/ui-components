import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvTagAlarm } from '../tag-alarm';
import { h } from '@stencil/core';
import { EAlarmSeverity } from '../../../utils/types/components';
import { ETagAlarmSize } from '../tag-alarm.types';

describe('tag-alarm (unit tests)', () => {
	let page: SpecPage;
	let component: KvTagAlarm;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagAlarm],
				html: `<kv-tag-alarm severity="1"></kv-tag-alarm>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `hideLabel` with false', () => {
			expect(component.hideLabel).toBe(false);
		});

		it('should initialize `size` with Normal', () => {
			expect(component.size).toBe(ETagAlarmSize.Normal);
		});
	});

	describe('when custom label and size are provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagAlarm],
				template: () => <kv-tag-alarm severity={EAlarmSeverity.One} size={ETagAlarmSize.Large} label="Test"></kv-tag-alarm>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `hideLabel` with false', () => {
			expect(component.hideLabel).toBe(false);
		});

		it('should initialize `size` with Large', () => {
			expect(component.size).toBe(ETagAlarmSize.Large);
		});

		it('should initialize `label` with "Test"', () => {
			expect(component.label).toMatch('Test');
		});
	});

	describe('when label is hidden', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagAlarm],
				template: () => <kv-tag-alarm severity={EAlarmSeverity.One} hideLabel={true}></kv-tag-alarm>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `hideLabel` with true', () => {
			expect(component.hideLabel).toBe(true);
		});
	});
});
