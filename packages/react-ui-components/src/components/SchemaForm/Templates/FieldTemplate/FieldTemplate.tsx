import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';
import { isSectionField } from '../utils';
import SectionField from './SectionField';
import ControlField from './ControlField';
import { ArrayDescriptionContext } from '../../contexts';
import styles from './FieldTemplate.module.scss';

const FieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const section = !props.hidden && isSectionField(props.schema, props.uiSchema, props.registry);
	return (
		<ArrayDescriptionContext.Provider value={{ fieldId: props.id, fieldTemplate: FieldTemplate }}>
			<div data-schema-form-field={section ? 'section' : 'control'} className={styles.FieldWrapper} hidden={props.hidden}>
				{props.hidden ? props.children : section ? <SectionField {...props} /> : <ControlField {...props} />}
			</div>
		</ArrayDescriptionContext.Provider>
	);
};

export default FieldTemplate;
