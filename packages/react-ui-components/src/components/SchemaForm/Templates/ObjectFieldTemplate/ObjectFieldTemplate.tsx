import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ADDITIONAL_PROPERTY_FLAG, FormContextType, ObjectFieldTemplateProps, RJSFSchema, StrictRJSFSchema, UiSchema, canExpand, getUiOptions } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { KvActionButtonIcon } from '../../../../stencil-generated';
import styles from './ObjectFieldTemplate.module.scss';
import { DEFAULT_INPUT_CONFIG, DEFAULT_INPUT_INLINE_CONFIG } from './config';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { isSectionField } from '../utils';
import { fitWidth } from './utils';
import { SchemaFormContext } from '../../types';

const ObjectFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	properties,
	uiSchema,
	schema,
	formData,
	onAddClick,
	disabled,
	readonly,
	formContext,
	registry
}: ObjectFieldTemplateProps<T, S, F>) => {
	const uiOptions = getUiOptions(uiSchema, registry.globalUiOptions);
	const inline = Boolean(uiOptions.inline);
	const { inputConfig = inline ? DEFAULT_INPUT_INLINE_CONFIG : DEFAULT_INPUT_CONFIG } = (formContext ?? {}) as SchemaFormContext;
	const rowWidth = uiOptions.inputWidth ?? inputConfig.width;
	const rowMinWidth = uiOptions.inputMinWidth ?? inputConfig.minWidth;
	const rowMaxWidth = uiOptions.inputMaxWidth ?? inputConfig.maxWidth;

	const inputWidthProps = useMemo(
		() => ({
			width: fitWidth(rowWidth),
			minWidth: fitWidth(rowMinWidth),
			maxWidth: fitWidth(rowMaxWidth)
		}),
		[rowWidth, rowMinWidth, rowMaxWidth]
	);
	const firstVisibleIndex = inline ? -1 : properties.findIndex(property => !property.hidden);
	let previousIsSection = false;
	return (
		<>
			<div data-schema-form-object data-schema-form-inline={inline || undefined} className={classNames(styles.PropsContainer, { [styles.Inline]: inline })}>
				{properties.map((element, index) => {
					const propertySchema = schema.properties?.[element.name] ?? {};
					const composed = typeof propertySchema !== 'boolean' && ['$ref', 'allOf', 'dependencies', 'if'].some(key => key in propertySchema);
					const resolved = composed ? registry.schemaUtils.retrieveSchema(propertySchema as S, get(formData, [element.name])) : propertySchema;
					const propertyUiSchema =
						typeof propertySchema !== 'boolean' && ADDITIONAL_PROPERTY_FLAG in propertySchema ? uiSchema?.additionalProperties : uiSchema?.[element.name];
					const section = typeof resolved !== 'boolean' && isSectionField(resolved as S, propertyUiSchema as UiSchema<T, S, F>, registry);
					const afterSection = !element.hidden && previousIsSection;
					if (!element.hidden) previousIsSection = section;
					return (
						<div
							key={element.name}
							style={inputWidthProps}
							data-schema-form-row={element.name}
							data-schema-form-first-row={index === firstVisibleIndex || undefined}
							data-schema-form-after-section={afterSection || undefined}
							className={classNames(styles.PropRow, { [styles.Hidden]: element.hidden, [styles.SectionRow]: section })}
						>
							{element.content}
						</div>
					);
				})}
				{canExpand(schema, uiSchema, formData) && (
					<div className={styles.AddButtonContainer}>
						<KvActionButtonIcon
							icon={EIconName.Add}
							accessibleLabel={SCHEMA_FORM_STRINGS.addProperty(get(uiSchema, ['ui:title']) || schema.title)}
							size={EComponentSize.Large}
							type={EActionButtonType.Primary}
							tabIndex={-1}
							disabled={disabled || readonly}
							onClickButton={onAddClick(schema)}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default ObjectFieldTemplate;
