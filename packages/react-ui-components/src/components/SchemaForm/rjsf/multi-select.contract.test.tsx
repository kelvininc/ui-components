// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form from '@rjsf/core';
import { WidgetProps } from '@rjsf/utils';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator, normalizeSchema } from '../../../utils';
import { MULTI_SELECT_SHAPES } from '../test-utils/matrix';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
const validator = getDefaultValidator();

describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('RJSF multi-select labels through $name', ({ FormComponent }) => {
	it.each(MULTI_SELECT_SHAPES)('preserves $name', row => {
		const normalized = normalizeSchema(row.schema);
		let options: WidgetProps['options']['enumOptions'];
		const Select = (props: WidgetProps): null => {
			options = props.options.enumOptions;
			return null;
		};

		renderToStaticMarkup(
			<FormComponent
				schema={normalized.schema}
				uiSchema={{ ...normalized.uiSchema, ...row.uiSchema }}
				formData={row.formData}
				validator={validator}
				widgets={{ select: Select }}
			/>
		);

		expect(options?.map(option => option.label)).toEqual(row.labels);
		expect(options?.map(option => option.value)).toEqual(['north-line', 'south-line']);
	});
});
