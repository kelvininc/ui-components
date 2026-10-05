// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form from '@rjsf/core';
import { FieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { CUSTOM_FIELDS, CUSTOM_FIELD_SHAPES } from '../test-utils/matrix';
import { hasCustomField } from './hasCustomField';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('custom field contract through $name', ({ FormComponent }) => {
	it.each(CUSTOM_FIELD_SHAPES)('matches SchemaField for $name', row => {
		let classified: boolean | undefined;
		const FieldTemplate = ({ children, registry, uiSchema, schema }: FieldTemplateProps) => {
			classified = hasCustomField(uiSchema, registry, schema);
			return <>{children}</>;
		};
		const markup = renderToStaticMarkup(
			<FormComponent
				schema={{ type: 'object', title: 'Connection' }}
				uiSchema={{ ...row.uiSchema, 'ui:globalOptions': 'globalUiOptions' in row ? row.globalUiOptions : undefined }}
				fields={CUSTOM_FIELDS}
				templates={{ FieldTemplate }}
				validator={getDefaultValidator()}
			/>
		);
		expect(markup.includes('data-custom-field')).toBe(row.custom);
		expect(classified).toBe(row.custom);
	});
	it('matches schema id registration', () => {
		let classified: boolean | undefined;
		const FieldTemplate = ({ children, registry, uiSchema, schema }: FieldTemplateProps) => {
			classified = hasCustomField(uiSchema, registry, schema);
			return <>{children}</>;
		};
		const markup = renderToStaticMarkup(
			<FormComponent schema={{ $id: 'Connection', type: 'object' }} fields={CUSTOM_FIELDS} templates={{ FieldTemplate }} validator={getDefaultValidator()} />
		);
		expect(markup).toContain('data-custom-field');
		expect(classified).toBe(true);
	});
});
