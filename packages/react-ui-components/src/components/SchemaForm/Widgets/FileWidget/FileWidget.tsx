import { EComponentSize, EActionButtonType, EIconName } from '@kelvininc/ui-components';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';

import { KvActionButtonIcon, KvActionButtonText, KvIcon } from '../../../../stencil-generated/components';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styles from './FileWidget.module.scss';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { FileInfoType } from './types';
import { extractFileInfo, processFiles } from './utils';

function FileActions({ fileInfo, onDelete, preview = false }: { fileInfo: FileInfoType; onDelete: (filename: string) => void; preview?: boolean }) {
	const { dataURL, name } = fileInfo;
	if (!dataURL) {
		return null;
	}

	return (
		<div className={styles.ActionsContainer}>
			{preview && (
				<a href={dataURL} download={`${name}`} target="_blank" rel="noreferrer">
					<KvActionButtonIcon icon={EIconName.Download} type={EActionButtonType.Tertiary} size={EComponentSize.Small} />
				</a>
			)}
			<KvActionButtonIcon icon={EIconName.Delete} type={EActionButtonType.Tertiary} size={EComponentSize.Small} onClickButton={() => onDelete(name)} />
		</div>
	);
}

function FilesInfo({
	displayLabel,
	filesInfo = [],
	preview = false,
	hasError = false,
	onDelete
}: {
	displayLabel: string;
	filesInfo: FileInfoType[];
	onDelete: (filename: string) => void;
	preview?: boolean;
	hasError?: boolean;
}) {
	return (
		<div className={styles.FileInfoContainer}>
			{filesInfo.map((fileInfo, key) => {
				const { name } = fileInfo;
				return (
					<div className={classNames(styles.FileInfo, styles.HasValue, { [styles.HasError]: hasError })} key={key}>
						<div className={styles.LeftContent}>
							<KvIcon name={EIconName.File} />
							<div className={styles.FileDetails}>
								<span className={styles.Label}>{displayLabel}</span>
								<span className={styles.FileName}>{name}</span>
							</div>
						</div>
						<FileActions fileInfo={fileInfo} preview={preview} onDelete={onDelete} />
					</div>
				);
			})}
			{isEmpty(filesInfo) && (
				<div className={classNames(styles.FileInfo, { [styles.HasError]: hasError })}>
					<div className={styles.LeftContent}>
						<KvIcon name={EIconName.File} />
						<div className={styles.FileDetails}>
							<span className={styles.Label}>{displayLabel}</span>
							<span className={styles.FileName}>Empty</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 *  The `FileWidget` is a widget for rendering file upload fields.
 *  It is typically used with a string property with data-url format.
 */
function FileWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: WidgetProps<T, S, F>) {
	const { disabled, readonly, required, multiple, onChange, value, options, uiSchema, schema, label, name, rawErrors = [] } = props;

	const [filesInfo, setFilesInfo] = useState<FileInfoType[]>(extractFileInfo(value));

	const displayedLabel = useMemo(() => get(uiSchema, ['ui:title']) || schema.title || label, [uiSchema, schema.title, label]);

	const removeFile = useCallback(
		(filename: string) => {
			const newValue = filesInfo.filter(fileInfo => fileInfo.name !== filename);
			setFilesInfo(newValue);
			if (multiple) {
				onChange(newValue.map(fileInfo => fileInfo.dataURL));
			} else {
				onChange(newValue[0]);
			}
		},
		[filesInfo, setFilesInfo, onChange]
	);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (!event.target.files) {
				return;
			}

			processFiles(event.target.files).then(filesInfoEvent => {
				const newValue = filesInfoEvent.map(fileInfo => fileInfo.dataURL);
				if (multiple) {
					setFilesInfo(filesInfo.concat(filesInfoEvent));
					onChange(value.concat(newValue));
				} else {
					setFilesInfo(filesInfoEvent);
					onChange(newValue[0]);
				}
			});
		},
		[multiple, value, filesInfo, onChange]
	);

	return (
		<div className={styles.FileWidgetContainer}>
			<div className={styles.FilesInfo}>
				<FilesInfo filesInfo={filesInfo} displayLabel={displayedLabel} preview={options.filePreview} hasError={!isEmpty(rawErrors)} onDelete={removeFile} />
			</div>
			<div className={styles.BrowseFilesButton}>
				<label htmlFor={`file_${name}`}>
					<KvActionButtonText type={EActionButtonType.Tertiary} size={EComponentSize.Small} text="Browse File" disabled={disabled}></KvActionButtonText>
				</label>
				<input
					id={`file_${name}`}
					type="file"
					value=""
					onInput={handleChange}
					required={value ? false : required}
					readOnly={readonly}
					accept={options.accept ? String(options.accept) : undefined}
					style={{ display: 'none' }}
					multiple={multiple}
				/>
			</div>
		</div>
	);
}

export default FileWidget;
