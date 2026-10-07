import { EComponentSize, EActionButtonType, EIconName, EValidationState } from '@kelvininc/ui-components';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps, getUiOptions } from '@rjsf/utils';
import { KvActionButtonIcon, KvActionButtonText, KvFormHelpText, KvIcon } from '../../../../stencil-generated';
import React, { useContext, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './FileWidget.module.scss';
import { FileInfoType } from './types';
import { FileArrayErrorsContext, useFieldDescription, useFieldErrors, useFormState } from '../../contexts';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { useSchemaFormFocusRef } from '../../hooks/entryFocus';
import { useFileValue } from './useFileValue';

const downloadFile = (dataURL: string, name: string) => {
	const link = document.createElement('a');
	link.href = dataURL;
	link.download = name;
	document.body.append(link);
	link.click();
	link.remove();
};

function FileRow({
	fileInfo,
	displayLabel,
	preview,
	disabled,
	hasError,
	errors,
	onDelete
}: {
	fileInfo?: FileInfoType;
	displayLabel: string;
	preview: boolean;
	disabled: boolean;
	hasError: boolean;
	errors: string[];
	onDelete: () => void;
}) {
	const [errorElement, setErrorElement] = useState<HTMLDivElement | null>(null);
	const description = useMemo(() => (errors.length && errorElement ? [errorElement] : []), [errors.length, errorElement]);
	const name = fileInfo?.name ?? SCHEMA_FORM_STRINGS.emptyFile;
	return (
		<>
			<div className={classNames(styles.FileInfo, { [styles.HasValue]: Boolean(fileInfo), [styles.HasError]: hasError || errors.length > 0 })}>
				<div className={styles.LeftContent}>
					<KvIcon name={EIconName.File} />
					<div className={styles.FileDetails}>
						<span className={styles.Label}>{displayLabel}</span>
						<span className={styles.FileName} title={fileInfo?.name}>
							{name}
						</span>
					</div>
				</div>
				{fileInfo && (
					<div className={styles.ActionsContainer}>
						{preview && fileInfo.dataURL && (
							<KvActionButtonIcon
								icon={EIconName.Download}
								accessibleLabel={SCHEMA_FORM_STRINGS.download(name)}
								type={EActionButtonType.Tertiary}
								size={EComponentSize.Small}
								onClickButton={() => downloadFile(fileInfo.dataURL!, name)}
							/>
						)}
						<KvActionButtonIcon
							icon={EIconName.Delete}
							accessibleLabel={SCHEMA_FORM_STRINGS.remove(name)}
							type={EActionButtonType.Tertiary}
							size={EComponentSize.Small}
							disabled={disabled}
							accessibleDescriptionElements={description}
							onClickButton={onDelete}
						/>
					</div>
				)}
			</div>
			{errors.length > 0 && (
				<div ref={setErrorElement}>
					<KvFormHelpText helpText={errors} state={EValidationState.Invalid} />
				</div>
			)}
		</>
	);
}

/** File values remain controlled by the form; reads and row actions share the latest committed list. */
function FileWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: WidgetProps<T, S, F>) {
	const { id, disabled, readonly, required, multiple, options, uiSchema, schema, label, registry, rawErrors = [] } = props;
	const { markFieldAsTouched } = useFormState();
	const { filesInfo, removeFile, handleChange, readError } = useFileValue(props);
	const inactive = Boolean(disabled || readonly);
	const focusRef = useSchemaFormFocusRef<HTMLKvActionButtonTextElement>(inactive);
	const inputRef = useRef<HTMLInputElement>(null);
	const fileErrors = useContext(FileArrayErrorsContext);
	const itemErrors = filesInfo.map((_, index) => (fileErrors?.fieldId === id ? fileErrors.errorSchema?.[index]?.__errors ?? [] : []));
	const hasVisibleErrors = useFieldErrors(id, rawErrors);
	const hasVisibleItemErrors = useFieldErrors(id, itemErrors.flat());
	const fieldDescription = useFieldDescription(id);
	const [readErrorElement, setReadErrorElement] = useState<HTMLDivElement | null>(null);
	const description = useMemo(() => [...(fieldDescription ?? []), ...(readError && readErrorElement ? [readErrorElement] : [])], [fieldDescription, readError, readErrorElement]);
	const uiOptions = getUiOptions(uiSchema, registry.globalUiOptions);
	const displayedLabel = uiOptions.title ?? schema.title ?? label;
	const fieldName = typeof displayedLabel === 'string' && displayedLabel.trim() ? displayedLabel : id;
	const defaultActionLabel = multiple ? SCHEMA_FORM_STRINGS.addFiles : filesInfo.length ? SCHEMA_FORM_STRINGS.replaceFile : SCHEMA_FORM_STRINGS.chooseFile;
	const actionLabel = typeof uiOptions.fileActionLabel === 'string' && uiOptions.fileActionLabel.trim() ? uiOptions.fileActionLabel.trim() : defaultActionLabel;
	return (
		<div className={styles.FileWidgetContainer}>
			<div className={styles.FilesInfo}>
				<div className={styles.FileInfoContainer}>
					{filesInfo.map((fileInfo, index) => (
						<div data-file-index={index} key={index}>
							<FileRow
								fileInfo={fileInfo}
								displayLabel={String(displayedLabel ?? '')}
								preview={Boolean(options.filePreview)}
								disabled={inactive}
								hasError={hasVisibleErrors}
								errors={hasVisibleItemErrors ? itemErrors[index] : []}
								onDelete={() => removeFile(index)}
							/>
						</div>
					))}
					{!filesInfo.length && (
						<FileRow displayLabel={String(displayedLabel ?? '')} preview={false} disabled={inactive} hasError={hasVisibleErrors} errors={[]} onDelete={() => {}} />
					)}
				</div>
				{readError && (
					<div ref={setReadErrorElement}>
						<KvFormHelpText helpText={readError} state={EValidationState.Invalid} />
					</div>
				)}
			</div>
			<div className={styles.BrowseFilesButton}>
				<KvActionButtonText
					id={id}
					ref={focusRef}
					type={EActionButtonType.Tertiary}
					size={EComponentSize.Small}
					text={actionLabel}
					accessibleLabel={SCHEMA_FORM_STRINGS.fileActionFor(actionLabel, fieldName)}
					accessibleDescriptionElements={description}
					disabled={inactive}
					onClickButton={() => {
						if (!inactive) inputRef.current?.click();
					}}
					onFocusButton={() => markFieldAsTouched(id)}
					onBlurButton={() => markFieldAsTouched(id)}
				/>
				<input
					ref={inputRef}
					id={`file_${id}`}
					type="file"
					value=""
					onChange={handleChange}
					required={!filesInfo.length && required}
					disabled={inactive}
					accept={options.accept ? String(options.accept) : undefined}
					style={{ display: 'none' }}
					multiple={multiple}
				/>
			</div>
		</div>
	);
}

export default FileWidget;
