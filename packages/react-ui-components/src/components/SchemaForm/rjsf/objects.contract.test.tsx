// @vitest-environment jsdom

import Form from '@rjsf/core';
import { ADDITIONAL_PROPERTY_FLAG, WrapIfAdditionalTemplateProps } from '@rjsf/utils';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { OBJECT_SHAPES } from '../test-utils/matrix';

const validator = getDefaultValidator();
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	container = document.createElement('div');
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
});

describe.each(OBJECT_SHAPES.filter(row => row.name.startsWith('additionalProperties')))('RJSF 6 property callbacks for $name', row => {
	it.each(['value', 'blur'])('renames the key and preserves its value through the %s callback', async callback => {
		let property: WrapIfAdditionalTemplateProps;
		const Wrapper = (props: WrapIfAdditionalTemplateProps) => {
			if (!Object.prototype.hasOwnProperty.call(props.schema, ADDITIONAL_PROPERTY_FLAG)) return <>{props.children}</>;
			property = props;
			return (
				<div>
					<input data-property-key="" defaultValue={props.label} onBlur={props.onKeyRenameBlur} />
					{props.children}
				</div>
			);
		};
		const onChange = vi.fn();
		await act(async () =>
			root.render(<Form schema={row.schema} formData={row.formData} validator={validator} templates={{ WrapIfAdditionalTemplate: Wrapper }} onChange={onChange} />)
		);

		if (callback === 'value') {
			await act(async () => property.onKeyRename('plant'));
		} else {
			const input = container.querySelector<HTMLInputElement>('[data-property-key]')!;
			input.value = 'plant';
			await act(async () => {
				input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
			});
		}

		expect(onChange.mock.lastCall?.[0].formData).toEqual({ plant: 'lisbon' });
	});
});
