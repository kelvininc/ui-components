// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form, { getDefaultRegistry } from '@rjsf/core';
import { ArrayFieldDescriptionProps, ArrayFieldTemplateProps, FieldProps, FieldTemplateProps, IdSchema, UiSchema } from '@rjsf/utils';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { ARRAY_ID_SHAPES, ARRAY_TEMPLATE_SHAPES } from '../test-utils/matrix';
import { generateTheme } from '../Theme';
import { FormStateProvider } from '../contexts';
import { getRenderedArrayFieldTemplate } from './arrayTemplate';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);
describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('array template contract through $name', ({ FormComponent }) => {
	it.each(ARRAY_TEMPLATE_SHAPES)('matches ArrayField.render for $name', row => {
		const ArrayTemplate = ({ items }: ArrayFieldTemplateProps) => (
			<div data-array-template>
				{items.map(item => (
					<div key={item.key}>{item.children}</div>
				))}
			</div>
		);
		let classified: boolean | undefined;
		const FieldTemplate = ({ children, registry, uiSchema, schema }: FieldTemplateProps) => {
			if (schema.type === 'array') classified = getRenderedArrayFieldTemplate(schema, uiSchema, registry) === ArrayTemplate;
			return <>{children}</>;
		};
		const markup = renderToStaticMarkup(
			<FormComponent schema={row.schema} uiSchema={row.uiSchema} templates={{ FieldTemplate, ArrayFieldTemplate: ArrayTemplate }} validator={getDefaultValidator()} />
		);
		expect(markup.includes('data-array-template')).toBe(row.rendered);
		expect(classified).toBe(row.rendered);
	});

	describe.each(ARRAY_ID_SHAPES)('custom description props for $name', row => {
		it.each([
			{ idPrefix: 'root', idSeparator: '_' },
			{ idPrefix: 'plant', idSeparator: '/' }
		])('preserves original ids with $idPrefix and $idSeparator', ids => {
			const ArrayField = getDefaultRegistry().fields.ArrayField;
			let originalIds: IdSchema;
			let originalUi: UiSchema;
			let observed: ArrayFieldDescriptionProps;
			const CaptureArray = (props: FieldProps) => {
				originalIds = props.idSchema;
				originalUi = props.uiSchema;
				return <ArrayField {...props} />;
			};
			const Description = (props: ArrayFieldDescriptionProps) => {
				observed = props;
				return <p>Custom connections description.</p>;
			};
			const theme = generateTheme();
			renderToStaticMarkup(
				<FormStateProvider>
					<FormComponent
						{...theme}
						{...ids}
						schema={row.schema}
						formData={[]}
						validator={getDefaultValidator()}
						fields={{ ...theme.fields, ArrayField: CaptureArray }}
						templates={{ ...theme.templates, ArrayFieldDescriptionTemplate: Description }}
					/>
				</FormStateProvider>
			);
			expect(observed!.idSchema).toBe(originalIds!);
			expect(observed!.uiSchema).toBe(originalUi!);
			expect(observed!.idSchema.$id).toBe(ids.idPrefix);
		});
	});
});
