import { EValidationState } from '@kelvininc/ui-components';
import { getDefaultRegistry } from '@rjsf/core';
import { FieldTemplateProps, FormContextType, getSchemaType, getTemplate, getUiOptions, getWidget, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { useId, useMemo, useState } from 'react';
import { KvFormHelpText } from '../../../../stencil-generated';
import { useArrayDescription, useFieldErrors } from '../../contexts';
import { EDescriptionPosition } from '../../types';
import { defaultArrayDescriptionTemplate, getRenderedArrayFieldTemplate, getRenderedArrayWidget } from '../../rjsf/arrayTemplate';
import { getChoiceWidget } from '../../rjsf/choiceWidget';
import { hasCustomField } from '../../rjsf/hasCustomField';
import FileWidget from '../../Widgets/FileWidget';
import ArrayField from '../../Fields/ArrayField/ArrayField';
import DefaultTitleFieldTemplate from '../TitleFieldTemplate/TitleFieldTemplate';
import ArrayFieldTemplate from '../ArrayFieldTemplate/ArrayFieldTemplate';
import buildDefaultHelperText, { buildHelperOptions } from './utils';
import styles from './FieldTemplate.module.scss';

export const useFieldPresentation = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const { id, rawErrors = [], rawDescription, label, schema, uiSchema, registry, formContext, required } = props;
	const hasErrors = useFieldErrors(id, rawErrors);
	const [errorElement, setErrorElement] = useState<HTMLDivElement | null>(null);
	const errorDescription = useMemo(() => ({ fieldId: id, elements: errorElement ? [errorElement] : [] }), [id, errorElement]);
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
	const schemaType = getSchemaType(schema);
	const arrayTemplate = getRenderedArrayFieldTemplate(schema, uiSchema, registry);
	const defaultFields = getDefaultRegistry<T, S, F>().fields;
	// Caller-defined type fields own their controls, even when the schema selects a file widget.
	const fileField =
		schemaType === 'array'
			? registry.fields.ArrayField === ArrayField || registry.fields.ArrayField === defaultFields.ArrayField
			: schemaType === 'string' && registry.fields.StringField === defaultFields.StringField;
	const widget =
		fileField && schemaType === 'array'
			? getRenderedArrayWidget(schema, uiSchema, registry)
			: fileField && schemaType === 'string' && !hasCustomField(uiSchema, registry, schema)
			? getChoiceWidget(props)
			: undefined;
	const fileWidget = Boolean(widget) && widget === getWidget(schema, FileWidget, registry.widgets);
	const collection = arrayTemplate === ArrayFieldTemplate || fileWidget;
	const descriptionPosition =
		(uiOptions.descriptionPosition as EDescriptionPosition) ?? (schemaType === 'object' || collection ? EDescriptionPosition.Top : EDescriptionPosition.Bottom);
	const arrayDescription = getTemplate('ArrayFieldDescriptionTemplate', registry, uiOptions);
	const customArrayDescription = getSchemaType(schema) === 'array' && arrayTemplate === ArrayFieldTemplate && arrayDescription !== defaultArrayDescriptionTemplate;
	const description = !customArrayDescription && descriptionPosition !== EDescriptionPosition.None ? uiOptions.description ?? rawDescription : undefined;
	const errors = hasErrors ? rawErrors : [];
	const helper = buildDefaultHelperText(buildHelperOptions(formContext, uiOptions), schema.default);
	const descriptionElement = description ? (
		<div id={descriptionId}>
			<KvFormHelpText helpText={description} state={EValidationState.None} />
		</div>
	) : null;
	const helperElement = helper ? <KvFormHelpText helpText={helper} /> : null;
	const topDescription = descriptionPosition === EDescriptionPosition.Top && descriptionElement;
	return {
		title,
		hasTitle,
		titleId,
		descriptionId,
		errorsId,
		descriptionPosition,
		collection,
		fileWidget,
		WrapIfAdditionalTemplate,
		errorDescription,
		arrayDescriptionContext: { fieldId: id, fieldTemplate: owner?.fieldTemplate, descriptionId: customArrayDescription ? descriptionId : undefined },
		defaultTitle: Title === DefaultTitleFieldTemplate,
		titleElement: hasTitle ? (
			<Title id={titleId} title={title} schema={schema} uiSchema={uiSchema} registry={registry} required={required && getSchemaType(schema) !== 'object'} />
		) : null,
		descriptionElement,
		collectionMetadataElement:
			collection && (topDescription || helperElement) ? (
				<div className={styles.CollectionMetadata} data-schema-form-collection-metadata>
					{topDescription}
					{helperElement}
				</div>
			) : null,
		errorsElement: errors.length ? (
			<div id={errorsId} ref={setErrorElement}>
				<KvFormHelpText helpText={errors} state={EValidationState.Invalid} />
			</div>
		) : null,
		helperElement
	};
};
