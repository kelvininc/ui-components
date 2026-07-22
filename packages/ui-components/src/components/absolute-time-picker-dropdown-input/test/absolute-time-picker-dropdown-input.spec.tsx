import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePickerDropdownInput } from '../absolute-time-picker-dropdown-input';
import { h } from '@stencil/core';
import { EAbsoluteTimePickerMode, EIconName } from '../../../types';

describe('Absolute Time Picker Dropdown Input (unit tests)', () => {
	let page: SpecPage;

	// This component in testing should always consider an initial date
	// to prevent snapshots changes
	describe('when default props and initial date are used', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => <kv-absolute-time-picker-dropdown-input initialDate={1681319856833} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('renders two calendars by default with only the outer navigation arrows', () => {
			const calendars = page.root.querySelectorAll('kv-calendar');
			expect(calendars.length).toBe(2);
			// First calendar: previous arrow only
			expect(calendars[0].hasAttribute('displaypreviousmontharrow')).toBe(true);
			expect(calendars[0].hasAttribute('displaynextmontharrow')).toBe(false);
			// Last calendar: next arrow only
			expect(calendars[1].hasAttribute('displaypreviousmontharrow')).toBe(false);
			expect(calendars[1].hasAttribute('displaynextmontharrow')).toBe(true);
		});
	});

	describe('when numberOfCalendars is set to 1', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => <kv-absolute-time-picker-dropdown-input initialDate={1681319856833} numberOfCalendars={1} />
			});
		});

		it('renders a single calendar exposing both navigation arrows', () => {
			const calendars = page.root.querySelectorAll('kv-calendar');
			expect(calendars.length).toBe(1);
			expect(calendars[0].hasAttribute('displaypreviousmontharrow')).toBe(true);
			expect(calendars[0].hasAttribute('displaynextmontharrow')).toBe(true);
		});
	});

	describe('when numberOfCalendars is set to 3', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => <kv-absolute-time-picker-dropdown-input initialDate={1681319856833} numberOfCalendars={3} />
			});
		});

		it('renders three consecutive calendars with arrows only on the outer ones', () => {
			const calendars = page.root.querySelectorAll('kv-calendar');
			expect(calendars.length).toBe(3);
			// First: previous only
			expect(calendars[0].hasAttribute('displaypreviousmontharrow')).toBe(true);
			expect(calendars[0].hasAttribute('displaynextmontharrow')).toBe(false);
			// Middle: no arrows
			expect(calendars[1].hasAttribute('displaypreviousmontharrow')).toBe(false);
			expect(calendars[1].hasAttribute('displaynextmontharrow')).toBe(false);
			// Last: next only
			expect(calendars[2].hasAttribute('displaypreviousmontharrow')).toBe(false);
			expect(calendars[2].hasAttribute('displaynextmontharrow')).toBe(true);
			// Consecutive months
			expect(calendars[0].getAttribute('initialdate')).toBe('2023-04-12');
			expect(calendars[1].getAttribute('initialdate')).toBe('2023-05-12');
			expect(calendars[2].getAttribute('initialdate')).toBe('2023-06-12');
		});
	});

	describe('when a value below the minimum is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => <kv-absolute-time-picker-dropdown-input initialDate={1681319856833} numberOfCalendars={0} />
			});
		});

		it('never renders fewer than one calendar', () => {
			expect(page.root.querySelectorAll('kv-calendar').length).toBe(1);
		});
	});

	describe('when a non-integer numberOfCalendars is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => <kv-absolute-time-picker-dropdown-input initialDate={1681319856833} numberOfCalendars={2.5} />
			});
		});

		it('floors the value instead of crashing on Array(size)', () => {
			expect(page.root.querySelectorAll('kv-calendar').length).toBe(2);
		});
	});

	describe('when fromInputConfig and toInputConfig are provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => (
					<kv-absolute-time-picker-dropdown-input
						initialDate={1681319856833}
						fromInputConfig={{ label: 'Start', placeholder: 'Pick a start', leftIcon: EIconName.Time }}
						toInputConfig={{ label: 'End', placeholder: 'Pick an end' }}
					/>
				)
			});
		});

		it('applies the label, placeholder and left icon overrides to the correct input', () => {
			const [fromInput, toInput] = Array.from(page.root.querySelectorAll('kv-date-time-input'));
			expect(fromInput.getAttribute('label')).toBe('Start');
			expect(fromInput.getAttribute('placeholder')).toBe('Pick a start');
			expect(fromInput.getAttribute('lefticon')).toBe(EIconName.Time);
			expect(toInput.getAttribute('label')).toBe('End');
			expect(toInput.getAttribute('placeholder')).toBe('Pick an end');
		});

		it('keeps component-controlled props intact when a config is provided', () => {
			const [fromInput, toInput] = Array.from(page.root.querySelectorAll('kv-date-time-input'));
			// value, inputStyleType and dateFormat are owned by the component regardless of the config
			expect(fromInput.getAttribute('value')).toBe('');
			expect(toInput.getAttribute('value')).toBe('');
			expect(fromInput.getAttribute('inputstyletype')).toBe('merged-left');
			expect(toInput.getAttribute('inputstyletype')).toBe('merged-right');
			expect(fromInput.getAttribute('dateformat')).toBe('dd-mm-yyyy HH:MM');
		});
	});

	describe('when in single mode with fromInputConfig', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => (
					<kv-absolute-time-picker-dropdown-input
						initialDate={1681319856833}
						mode={EAbsoluteTimePickerMode.Single}
						fromInputConfig={{ label: 'When', placeholder: 'Pick a moment' }}
					/>
				)
			});
		});

		it('uses fromInputConfig on the single input', () => {
			const inputs = page.root.querySelectorAll('kv-date-time-input');
			expect(inputs.length).toBe(1);
			expect(inputs[0].getAttribute('label')).toBe('When');
			expect(inputs[0].getAttribute('placeholder')).toBe('Pick a moment');
		});
	});
});
