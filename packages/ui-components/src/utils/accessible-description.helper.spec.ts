import { setAccessibleDescriptionElements } from './accessible-description.helper';

type DescribedInput = HTMLInputElement & { ariaDescribedByElements: readonly Element[] | null };

const reflectedControl = () => {
	const control = document.createElement('input');
	let references: readonly Element[] | null = null;
	Object.defineProperty(control, 'ariaDescribedByElements', {
		get: () => references,
		set: (elements: readonly Element[] | null) => {
			references = elements;
			if (elements === null) control.removeAttribute('aria-describedby');
			else control.setAttribute('aria-describedby', '');
		}
	});
	return control as DescribedInput;
};

describe('accessible description ownership', () => {
	it('updates references by element identity and clears them when omitted', () => {
		const control = reflectedControl();
		const errors = document.createElement('div');
		const replacement = document.createElement('div');
		setAccessibleDescriptionElements(control, [errors]);
		expect(control.ariaDescribedByElements).toEqual([errors]);
		setAccessibleDescriptionElements(control, [replacement]);
		expect(control.ariaDescribedByElements).toEqual([replacement]);
		setAccessibleDescriptionElements(control);
		expect(control.ariaDescribedByElements).toBeNull();
		expect(control.hasAttribute('aria-describedby')).toBe(false);
	});

	it('clears references with an empty array', () => {
		const control = reflectedControl();
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		setAccessibleDescriptionElements(control, []);
		expect(control.ariaDescribedByElements).toEqual([]);
	});

	it('preserves a caller ID relationship when the API has never owned the control', () => {
		const control = reflectedControl();
		control.setAttribute('aria-describedby', 'connection-help');
		setAccessibleDescriptionElements(control);
		expect(control.getAttribute('aria-describedby')).toBe('connection-help');
	});

	it('preserves a new caller ID relationship after its element references clear', () => {
		const control = reflectedControl();
		control.setAttribute('aria-describedby', 'previous-help');
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		control.setAttribute('aria-describedby', 'connection-help');
		setAccessibleDescriptionElements(control);
		expect(control.getAttribute('aria-describedby')).toBe('connection-help');
	});

	it.each(['connection-help', ''])('restores the original ID attribute %p after reference updates and clearing', description => {
		const control = reflectedControl();
		control.setAttribute('aria-describedby', description);
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		setAccessibleDescriptionElements(control, []);
		setAccessibleDescriptionElements(control);
		expect(control.getAttribute('aria-describedby')).toBe(description);
	});

	it('restores a new caller ID after another element-reference update', () => {
		const control = reflectedControl();
		control.setAttribute('aria-describedby', 'previous-help');
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		control.setAttribute('aria-describedby', 'connection-help');
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		setAccessibleDescriptionElements(control);
		expect(control.getAttribute('aria-describedby')).toBe('connection-help');
		setAccessibleDescriptionElements(control, []);
		setAccessibleDescriptionElements(control);
		expect(control.getAttribute('aria-describedby')).toBe('connection-help');
	});

	it('preserves a caller removal across another element-reference update', () => {
		const control = reflectedControl();
		control.setAttribute('aria-describedby', 'previous-help');
		setAccessibleDescriptionElements(control, [document.createElement('div')]);
		control.removeAttribute('aria-describedby');
		setAccessibleDescriptionElements(control, []);
		setAccessibleDescriptionElements(control);
		expect(control.hasAttribute('aria-describedby')).toBe(false);
	});

	it('tolerates an absent control and a platform without reflected element references', () => {
		const unsupported = {} as Element;
		setAccessibleDescriptionElements(undefined, []);
		setAccessibleDescriptionElements(unsupported, []);
		expect('ariaDescribedByElements' in unsupported).toBe(false);
	});
});
