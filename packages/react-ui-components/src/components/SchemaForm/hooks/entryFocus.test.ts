// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { FOCUS_HOLDER_RESTORE_CASES } from '../test-utils/matrix';
import { focusFromHolder } from './entryFocus';

afterEach(() => {
	document.body.replaceChildren();
});

describe.each(FOCUS_HOLDER_RESTORE_CASES)('focus holder on $name', row => {
	it('names the container while it holds focus and restores what a re-render left alone', () => {
		const list = document.createElement('div');
		Object.entries(row.before).forEach(([attribute, value]) => list.setAttribute(attribute, value));
		document.body.append(list, document.createElement('button'));
		focusFromHolder(list, 'Variables', undefined, () => true);
		expect(document.activeElement).toBe(list);
		expect(list.getAttribute('role')).toBe('group');
		expect(list.getAttribute('aria-label')).toBe('Variables');
		expect(list.getAttribute('tabindex')).toBe('-1');
		Object.entries(row.change).forEach(([attribute, value]) => (value === null ? list.removeAttribute(attribute) : list.setAttribute(attribute, value)));
		list.blur();
		Object.entries(row.after).forEach(([attribute, value]) => expect(list.getAttribute(attribute), attribute).toBe(value));
	});
});
