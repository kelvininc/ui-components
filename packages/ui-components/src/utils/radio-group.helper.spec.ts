import { getRadioGroupTabStop, handleRadioGroupKeyDown, RadioGroupOption } from './radio-group.helper';

describe('radio group navigation', () => {
	it.each([
		{ name: 'selected enabled option', options: [{ value: 'telemetry' }, { value: 'alarms', checked: true }], expected: 1 },
		{ name: 'unselected options', options: [{ value: 'telemetry' }, { value: 'alarms' }], expected: 0 },
		{ name: 'disabled selection', options: [{ value: 'telemetry', disabled: true, checked: true }, { value: 'alarms' }], expected: 1 },
		{ name: 'numeric zero', options: [{ value: 0, checked: true }, { value: 1 }], expected: 0 },
		{ name: 'empty options', options: [], expected: -1 },
		{ name: 'all disabled', options: [{ value: 'telemetry', disabled: true }], expected: -1 }
	])('chooses the Tab stop for $name', ({ options, expected }) => {
		expect(getRadioGroupTabStop(options)).toBe(expected);
	});

	const navigate = (key: string, from: number, options: RadioGroupOption[], init: KeyboardEventInit = {}, role = 'radio', cancelled = false) => {
		const radio = document.createElement('div');
		radio.setAttribute('role', role);
		const hosts = options.map(() => Object.assign(document.createElement('div'), { focus: jest.fn() }));
		const event = new KeyboardEvent('keydown', { key, cancelable: true, ...init });
		Object.defineProperty(event, 'composedPath', { value: () => [radio, hosts[from]].filter(Boolean) });
		if (cancelled) event.preventDefault();
		const select = jest.fn();
		handleRadioGroupKeyDown(event, options, hosts, select);
		return {
			values: select.mock.calls.map(([value]) => value),
			focused: hosts.flatMap((host, index) => (host.focus.mock.calls.length ? [index] : [])),
			prevented: event.defaultPrevented
		};
	};
	const options = [{ value: 'telemetry', checked: true }, { value: 'alarms', disabled: true }, { value: 'commands' }];

	it.each([
		{ key: 'ArrowRight', from: 0, next: 2 },
		{ key: 'ArrowDown', from: 0, next: 2 },
		{ key: 'ArrowLeft', from: 0, next: 2 },
		{ key: 'ArrowUp', from: 0, next: 2 },
		{ key: 'ArrowRight', from: 2, next: 0 },
		{ key: 'ArrowLeft', from: 2, next: 0 },
		{ key: 'ArrowRight', from: 1, next: 2 }
	])('selects and focuses $next on $key from $from', ({ key, from, next }) => {
		expect(navigate(key, from, options)).toEqual({ values: [options[next].value], focused: [next], prevented: true });
	});

	it('preserves numeric values, including zero', () => {
		expect(navigate('ArrowRight', 1, [{ value: 0 }, { value: 1, checked: true }])).toEqual({ values: [0], focused: [0], prevented: true });
	});

	it.each([
		{ key: 'ArrowRight', next: 2 },
		{ key: 'ArrowDown', next: 2 },
		{ key: 'ArrowLeft', next: 0 },
		{ key: 'ArrowUp', next: 0 }
	])('moves in the correct direction on $key', ({ key, next }) => {
		const enabled = [{ value: 'telemetry', checked: true }, { value: 'alarms' }, { value: 'commands' }];
		expect(navigate(key, 1, enabled)).toEqual({ values: [enabled[next].value], focused: [next], prevented: true });
	});

	it.each(['altKey', 'ctrlKey', 'metaKey', 'shiftKey'])('leaves %s shortcuts unchanged', modifier => {
		expect(navigate('ArrowRight', 0, options, { [modifier]: true })).toEqual({ values: [], focused: [], prevented: false });
	});

	it.each(['link', 'checkbox'])('ignores keys from a %s', role => {
		expect(navigate('ArrowRight', 0, options, {}, role)).toEqual({ values: [], focused: [], prevented: false });
	});

	it('ignores a radio outside the supplied option hosts', () => {
		expect(navigate('ArrowRight', -1, options)).toEqual({ values: [], focused: [], prevented: false });
	});

	it('respects a previously prevented event', () => {
		expect(navigate('ArrowRight', 0, options, {}, 'radio', true)).toEqual({ values: [], focused: [], prevented: true });
	});

	it.each([
		{ name: 'empty', options: [] },
		{ name: 'all disabled', options: [{ value: 'telemetry', disabled: true }] }
	])('ignores arrows for $name options', ({ options: unavailable }) => {
		expect(navigate('ArrowRight', 0, unavailable)).toEqual({ values: [], focused: [], prevented: false });
	});

	it('leaves other keys to their control', () => {
		expect(navigate('Tab', 0, options)).toEqual({ values: [], focused: [], prevented: false });
	});
});
