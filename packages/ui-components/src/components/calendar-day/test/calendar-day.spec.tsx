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

		it('should initialize `inRangeStartDate` with false', () => {
			expect(component.isRangeStartDate).toBe(false);
		});

		it('should initialize `inRangeEndDate` with false', () => {
			expect(component.isRangeEndDate).toBe(false);
		});

		it('should initialize `isToday` with false', () => {
			expect(component.isToday).toBe(false);
		});

		it('should initialize `isBetweenSelectedDates` with false', () => {
			expect(component.isBetweenSelectedDates).toBe(false);
		});
	});
});
