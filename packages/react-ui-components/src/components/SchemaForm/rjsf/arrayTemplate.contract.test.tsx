// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form, { getDefaultRegistry } from '@rjsf/core';
import { ArrayFieldDescriptionProps, ArrayFieldTemplateProps, FieldProps, FieldTemplateProps, getWidget, IdSchema, UIOptionsType, UiSchema } from '@rjsf/utils';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { ARRAY_ID_SHAPES, ARRAY_TEMPLATE_OPTION_SHAPES, ARRAY_TEMPLATE_SHAPES, COLLECTION_DESCRIPTION_SHAPES } from '../test-utils/matrix';
import { generateTheme } from '../Theme';
import { FormStateProvider } from '../contexts';
import { getRenderedArrayFieldTemplate, getRenderedArrayWidget } from './arrayTemplate';
import FileWidget from '../Widgets/FileWidget';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);
describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('array template contract through $name', ({ FormComponent }) => {
	it.each(COLLECTION_DESCRIPTION_SHAPES.filter(row => row.schema.type === 'array'))('identifies the actual file widget for $name', row => {
		let fileWidget = false;
		const theme = generateTheme();
		const FieldTemplate = ({ children, id, registry, uiSchema, schema }: FieldTemplateProps) => {
			if (id === 'root') fileWidget = getRenderedArrayWidget(schema, uiSchema, registry) === getWidget(schema, FileWidget, registry.widgets);
			return <>{children}</>;
		};
		const markup = renderToStaticMarkup(
			<FormStateProvider>
				<FormComponent
					{...theme}
					schema={row.schema}
					uiSchema={row.uiSchema}
					formData={row.formData}
					widgets={{ ...theme.widgets, ...row.widgets }}
					templates={{ ...theme.templates, FieldTemplate }}
					validator={getDefaultValidator()}
				/>
			</FormStateProvider>
		);
		expect(markup.includes('id="file_root"')).toBe(row.kind === 'file');
		expect(fileWidget).toBe(row.kind === 'file');
	});

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

	describe.each(ARRAY_ID_SHAPES.filter(row => row.name !== 'nested arrays'))('template options for $name', shape => {
		it.each(ARRAY_TEMPLATE_OPTION_SHAPES)('matches the rendered $name', options => {
			const RegistryTemplate = () => <div data-array-source="registry" />;
			const GlobalTemplate = () => <div data-array-source="global" />;
			const LocalTemplate = () => <div data-array-source="local" />;
			const globalUiOptions: UIOptionsType = { ArrayFieldTemplate: GlobalTemplate };
			let classified: unknown;
			const FieldTemplate = ({ children, registry, uiSchema, schema }: FieldTemplateProps) => {
				classified = getRenderedArrayFieldTemplate(schema, uiSchema, registry);
				return <>{children}</>;
			};
			const markup = renderToStaticMarkup(
				<FormComponent
					schema={shape.schema}
					uiSchema={{
						'ui:globalOptions': options.global ? globalUiOptions : undefined,
						'ui:ArrayFieldTemplate': options.local ? LocalTemplate : undefined
					}}
					templates={{ FieldTemplate, ArrayFieldTemplate: RegistryTemplate }}
					validator={getDefaultValidator()}
				/>
			);
			expect(markup).toContain(`data-array-source="${options.local ? 'local' : 'registry'}"`);
			expect(markup).not.toContain('data-array-source="global"');
			expect(classified).toBe(options.local ? LocalTemplate : RegistryTemplate);
		});
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
