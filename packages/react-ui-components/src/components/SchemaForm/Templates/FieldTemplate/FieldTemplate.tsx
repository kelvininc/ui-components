import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { useContext, useEffect } from 'react';
import { isSectionField } from '../utils';
import SectionField from './SectionField';
import ControlField from './ControlField';
import { ArrayDescriptionContext, ArrayItemsContext, FieldDescriptionContext, ParentFieldIdContext, useFormState } from '../../contexts';
import styles from './FieldTemplate.module.scss';

const FieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const parentId = useContext(ParentFieldIdContext);
	const { registerField } = useFormState();
	useEffect(() => registerField(props.id, parentId), [registerField, props.id, parentId]);
	const section = !props.hidden && isSectionField(props.schema, props.uiSchema, props.registry);
	return (
		<ArrayItemsContext.Provider value={null}>
			<ArrayDescriptionContext.Provider value={{ fieldId: props.id, fieldTemplate: FieldTemplate }}>
				<ParentFieldIdContext.Provider value={props.id}>
					<FieldDescriptionContext.Provider value={null}>
						<div data-schema-form-field={section ? 'section' : 'control'} className={styles.FieldWrapper} hidden={props.hidden}>
							{props.hidden ? props.children : section ? <SectionField {...props} /> : <ControlField {...props} />}
						</div>
					</FieldDescriptionContext.Provider>
				</ParentFieldIdContext.Provider>
			</ArrayDescriptionContext.Provider>
		</ArrayItemsContext.Provider>
	);
};

export default FieldTemplate;
