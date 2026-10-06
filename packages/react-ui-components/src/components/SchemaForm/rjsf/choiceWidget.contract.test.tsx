// @vitest-environment jsdom
import { createRequire } from 'node:module';
import Form from '@rjsf/core';
import { FieldTemplateProps, WidgetProps } from '@rjsf/utils';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import BooleanField from '../Fields/BooleanField/BooleanField';
import { CHOICE_DISPATCH_SHAPES } from '../test-utils/matrix';
import { getChoiceWidget } from './choiceWidget';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
const probe = (name: string) =>
	function WidgetProbe() {
		return <span data-dispatched-widget={name} />;
	};
const radio = probe('radio');
const custom = probe('custom');
describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('choice widget contract through $name', ({ FormComponent }) => {
	it.each(CHOICE_DISPATCH_SHAPES)('matches the actual field for $name', row => {
		const registered = {
			RadioWidget: radio,
			SelectWidget: probe('select'),
			TextWidget: probe('text'),
			EmailWidget: row.formatWidget === 'radio' ? radio : row.formatWidget === 'custom' ? custom : probe('email'),
			CheckboxWidget: probe('checkbox'),
			connectionChoice: custom
		};
		const FieldTemplate = (props: FieldTemplateProps) => {
			const Widget = getChoiceWidget(props);
			return (
				<>
					{props.children}
					<Widget {...({} as WidgetProps)} />
				</>
			);
		};
		const markup = renderToStaticMarkup(
			<FormComponent
				schema={row.schema}
				uiSchema={row.uiSchema}
				fields={{ BooleanField }}
				widgets={registered}
				templates={{ FieldTemplate }}
				validator={getDefaultValidator()}
			/>
		);
		// The first probe comes from the actual RJSF field, the second from the copied resolver.
		expect(Array.from(markup.matchAll(/data-dispatched-widget="([^"]+)"/g), match => match[1])).toEqual([row.expected, row.expected]);
	});
});
