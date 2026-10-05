import { EValidationState } from '@kelvininc/ui-components';
import { FieldTemplateProps, FormContextType, getSchemaType, getTemplate, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { useId } from 'react';
import { KvFormHelpText } from '../../../../stencil-generated';
import { useArrayDescription, useFormState } from '../../contexts';
import { EDescriptionPosition } from '../../types';
import { defaultArrayDescriptionTemplate, getRenderedArrayFieldTemplate } from '../../rjsf/arrayTemplate';
import DefaultTitleFieldTemplate from '../TitleFieldTemplate/TitleFieldTemplate';
import ArrayFieldTemplate from '../ArrayFieldTemplate/ArrayFieldTemplate';
import buildDefaultHelperText, { buildHelperOptions } from './utils';

export const useFieldPresentation = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const { id, rawErrors = [], rawDescription, label, schema, uiSchema, registry, formContext, required } = props;
	const { isFieldTouched, displayErrors } = useFormState();
	const owner = useArrayDescription();
	const instanceId = useId();
	const titleId = `${instanceId}-title`;
	const descriptionId = `${instanceId}-description`;
	const errorsId = `${instanceId}-errors`;
	const uiOptions = getUiOptions(uiSchema, registry.globalUiOptions);
	const title = uiOptions.title ?? label;
	const hasTitle = uiOptions.label !== false && typeof title === 'string' && Boolean(title.trim());
	const Title = getTemplate('TitleFieldTemplate', registry, uiOptions);
	const WrapIfAdditionalTemplate = getTemplate('WrapIfAdditionalTemplate', registry, uiOptions);
	const descriptionPosition =
		(uiOptions.descriptionPosition as EDescriptionPosition) ?? (getSchemaType(schema) === 'object' ? EDescriptionPosition.Top : EDescriptionPosition.Bottom);
	const arrayDescription = getTemplate('ArrayFieldDescriptionTemplate', registry, uiOptions);
	const customArrayDescription =
		getSchemaType(schema) === 'array' &&
		getRenderedArrayFieldTemplate(schema, uiSchema, registry) === ArrayFieldTemplate &&
		arrayDescription !== defaultArrayDescriptionTemplate;
	const description = !customArrayDescription && descriptionPosition !== EDescriptionPosition.None ? uiOptions.description ?? rawDescription : undefined;
	const errors = isFieldTouched(id) || displayErrors ? rawErrors : [];
	const helper = buildDefaultHelperText(buildHelperOptions(formContext, uiOptions), schema.default);
	return {
		title,
		hasTitle,
		titleId,
		descriptionId,
		errorsId,
		descriptionPosition,
		WrapIfAdditionalTemplate,
		arrayDescriptionContext: { fieldId: id, fieldTemplate: owner?.fieldTemplate, descriptionId: customArrayDescription ? descriptionId : undefined },
		defaultTitle: Title === DefaultTitleFieldTemplate,
		titleElement: hasTitle ? (
			<Title id={titleId} title={title} schema={schema} uiSchema={uiSchema} registry={registry} required={required && getSchemaType(schema) !== 'object'} />
		) : null,
		descriptionElement: description ? (
			<div id={descriptionId}>
				<KvFormHelpText helpText={description} state={EValidationState.None} />
			</div>
		) : null,
		errorsElement: errors.length ? (
			<div id={errorsId}>
				<KvFormHelpText helpText={errors} state={EValidationState.Invalid} />
			</div>
		) : null,
		helperElement: helper ? <KvFormHelpText helpText={helper} /> : null
	};
};
