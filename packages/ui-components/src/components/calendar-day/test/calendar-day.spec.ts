import { SpecPage } from '@stencil/core/internal';
import { KvCalendarDay } from '../calendar-day';
import { newSpecPage } from '@stencil/core/testing';

describe('Calendar Day (unit tests)', () => {
	let page: SpecPage;
	let component: KvCalendarDay;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarDay],
				html: '<kv-calendar-day day="12"></kv-calendar-day>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `active` with false', () => {
			expect(component.active).toBe(false);
		});

		it('should initialize `inRange` with false', () => {
			expect(component.inRange).toBe(false);
		});

		it('should initialize `leftRounded` with false', () => {
			expect(component.leftRounded).toBe(false);
		});

		it('should initialize `rightRounded` with false', () => {
			expect(component.rightRounded).toBe(false);
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarDay],
				html: '<kv-calendar-day day="12" disabled></kv-calendar-day>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with true', () => {
			expect(component.disabled).toBe(true);
		});
	});

	describe('when is active', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarDay],
				html: '<kv-calendar-day day="12" active></kv-calendar-day>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `active` with true', () => {
			expect(component.active).toBe(true);
		});
	});

	describe('when is "in range"', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarDay],
				html: '<kv-calendar-day day="12" in-range></kv-calendar-day>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `inRange` with true', () => {
			expect(component.inRange).toBe(true);
		});
	});

	describe('when is "left rounded"', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarDay],
				html: '<kv-calendar-day day="12" left-rounded></kv-calendar-day>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `leftRounded` with true', () => {
			expect(component.leftRounded).toBe(true);
		});
	});

	describe('when is "right rounded"', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarDay],
				html: '<kv-calendar-day day="12" right-rounded></kv-calendar-day>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `rightRounded` with true', () => {
			expect(component.rightRounded).toBe(true);
		});
	});
});
