import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import Form, { FormProps, IChangeEvent, utils, withTheme } from '@rjsf/core';
import classNames from 'classnames';
import { cloneDeep, isEmpty, isEqualWith } from 'lodash-es';
import React, { Component } from 'react';
import { getScrollTop } from '../../utils/useScroll';
import { KvActionButtonText } from '../stencil-generated';
import styles from './SchemaForm.module.scss';
import Theme from './Theme';

const ThemedForm = withTheme(Theme);
const { getSubmitButtonOptions } = utils;
const SCROLL_OFFSET = 10;

export interface SchemaFormProps<T> extends FormProps<T> {
	submittedData?: T;
	allowDiscardChanges?: boolean;
}

export default class KvSchemaForm<T> extends Component<
	SchemaFormProps<T>,
	{
		isValid: boolean;
		hasChanges: boolean;
		isScrolling: boolean;
		formData: T | undefined;
	}
> {
	private formRef: any;

	// TODO: missing a useEffect to update the hasChanges when  props.submittedData change

	constructor(props: SchemaFormProps<T>) {
		super(props);
		console.log('KvSchemaForm props', props);
		this.state = {
			isValid: !props.liveValidate,
			hasChanges: !isEqualWith(props.formData, props.submittedData || {}),
			formData: props.formData || ({} as T),
			isScrolling: false
		};
	}

	discardChanges = () => {
		this.setState({
			formData: cloneDeep(this.props.submittedData),
			isValid: !this.props.liveValidate,
			hasChanges: false
		});
	};

	handleFormScroll = (data: React.UIEvent<HTMLDivElement>) => {
		this.setState({
			isScrolling: getScrollTop(data.currentTarget) - SCROLL_OFFSET > 0
		});
	};

	componentDidMount() {
		this.formRef.formElement.querySelector(['[class^="FieldTemplate"]']).addEventListener('scroll', this.handleFormScroll);
	}

	componentWillUnmount() {
		this.formRef.formElement.querySelector(['[class^="FieldTemplate"]']).removeEventListener('scroll', this.handleFormScroll);
	}

	render() {
		const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(this.props.uiSchema || {});

		const themedProps = {
			...this.props,
			ref: (form: Form<T>) => (this.formRef = form),
			onChange: (data: IChangeEvent<T>) => {
				const hasChanges = !isEqualWith(data.formData || {}, this.props.submittedData || {});
				this.setState({
					isValid: this.props.liveValidate ? hasChanges && isEmpty(data.errors) : true,
					hasChanges,
					formData: data.formData
				});

				if (this.props.onChange != undefined) {
					this.props.onChange(data);
				}
			},
			uiSchema: {
				...this.props.uiSchema,
				'ui:submitButtonOptions': {
					props: { disabled: false },
					norender: true,
					submitText: ''
				}
			},
			formData: this.state.formData
		};
		return (
			<div className={classNames(styles['form-container'], {})}>
				<ThemedForm {...themedProps}>
					{(this.props.allowDiscardChanges || !norender) && (
						<div className={classNames(styles['form-footer'], { [styles.scrolling]: this.state.isScrolling })}>
							{this.props.allowDiscardChanges && (
								<KvActionButtonText
									text="Discard Changes"
									disabled={!this.state.hasChanges}
									size={EComponentSize.Large}
									type={EActionButtonType.Tertiary}
									onClickButton={this.discardChanges}
								></KvActionButtonText>
							)}
							{!norender && (
								<button tabIndex={-1} className={styles['reset-button-style']} type="submit">
									<KvActionButtonText
										text={submitText || 'Save'}
										disabled={!this.state.isValid || submitButtonProps?.disabled}
										size={EComponentSize.Large}
										type={EActionButtonType.Primary}
									></KvActionButtonText>
								</button>
							)}
						</div>
					)}
				</ThemedForm>
			</div>
		);
	}
}
