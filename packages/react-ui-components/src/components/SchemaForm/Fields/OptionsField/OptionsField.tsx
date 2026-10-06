import { getDefaultRegistry } from '@rjsf/core';
import { FieldProps, FormContextType, getTemplate, getUiOptions, Registry, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';
import { get, omit } from 'lodash';
import React, { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { OptionSectionContext } from '../../contexts';
import { mergeUiSchemas } from '../../rjsf/merge';
import FieldTemplate from '../../Templates/FieldTemplate';
import { isSectionField } from '../../Templates/utils';
import styles from './OptionsField.module.scss';

type OptionsKey = 'oneOf' | 'anyOf';

const SelectedBranchContext = createContext<{ registry: Registry; instance: symbol } | undefined>(undefined);

// MultiSchemaField supplies the branch it actually selected, including its branch UI.
const SelectedBranchField = (props: FieldProps) => {
	const { registry, instance } = useContext(SelectedBranchContext)!;
	const report = useContext(OptionSectionContext);
	const uiOptions = getUiOptions(props.uiSchema, registry.globalUiOptions);
	const hidden = uiOptions.widget === 'hidden';
	const defaultTemplate = getTemplate('FieldTemplate', registry, uiOptions) === FieldTemplate;
	const section = !hidden && isSectionField(props.schema, props.uiSchema, registry);
	const id = props.idSchema.$id;
	useLayoutEffect(() => {
		report?.(id, instance, section);
		return () => report?.(id, instance, undefined);
	}, [report, id, instance, section]);
	const SchemaField = registry.fields.SchemaField;
	return (
		<div data-schema-form-option-branch data-schema-form-default-template={defaultTemplate || undefined} hidden={hidden}>
			<SchemaField {...props} registry={registry} />
		</div>
	);
};

// These settings name or configure the selector. A branch can supply its own.
const SELECTOR_OPTIONS = [
	'title',
	'description',
	'help',
	'placeholder',
	'autofocus',
	'autocomplete',
	'widget',
	'field',
	'enumDisabled',
	'classNames',
	...Object.keys(getDefaultRegistry().templates)
];
const SELECTOR_KEYS = ['oneOf', 'anyOf', 'classNames', ...SELECTOR_OPTIONS.map(option => `ui:${option}`)];

export const buildOptionsUiSchemas = <T, S extends StrictRJSFSchema, F extends FormContextType>(
	uiSchema: UiSchema<T, S, F> | undefined,
	count: number,
	keyword: OptionsKey
): UiSchema<T, S, F>[] => {
	const inherited = { ...omit(uiSchema, SELECTOR_KEYS), 'ui:options': omit(uiSchema?.['ui:options'], SELECTOR_OPTIONS) };
	const provided = get(uiSchema, [keyword], []);
	return Array.from({ length: count }, (_, index) => {
		const branch = mergeUiSchemas<T, S, F>(inherited, { 'ui:options': { label: false } }, provided[index]);
		// Branch ordering overrides parent ordering even when the two use different UI forms.
		const order = getUiOptions(provided[index]).order ?? getUiOptions(branch).order;
		if (Array.isArray(order)) {
			branch['ui:order'] = order.includes('*') ? [...order] : [...order, '*'];
			branch['ui:options'] = omit(branch['ui:options'], ['order']);
		}
		return branch;
	});
};

const generateOptionsField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(keyword: OptionsKey) => {
	const fieldName = keyword === 'oneOf' ? 'OneOfField' : 'AnyOfField';
	const DefaultField = getDefaultRegistry<T, S, F>().fields[fieldName];
	const OptionsField = (props: FieldProps<T, S, F>) => {
		const [instance] = useState(() => Symbol(keyword));
		const branchContext = useMemo(() => ({ registry: props.registry, instance }), [props.registry, instance]);
		const registry = useMemo(() => ({ ...props.registry, fields: { ...props.registry.fields, SchemaField: SelectedBranchField } }), [props.registry]);
		const count = (props.options ?? get(props.schema, [keyword], [])).length;
		const uiSchema = { ...props.uiSchema, [keyword]: buildOptionsUiSchemas(props.uiSchema, count, keyword) };
		return (
			<SelectedBranchContext.Provider value={branchContext}>
				<div className={styles.OptionsContainer}>
					<DefaultField {...props} uiSchema={uiSchema} registry={registry} />
				</div>
			</SelectedBranchContext.Provider>
		);
	};
	OptionsField.displayName = fieldName;
	return OptionsField;
};

export const OneOfField = generateOptionsField('oneOf');
export const AnyOfField = generateOptionsField('anyOf');
