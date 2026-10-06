import { FieldTemplateProps, FormContextType, ObjectFieldTemplateProps, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React, { CSSProperties, useContext } from 'react';
import { get } from 'lodash';
import { TableCellContext, TableLayout, TableRowContext } from '../../contexts/TableContext';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import FieldHelp from '../TitleFieldTemplate/FieldHelp';
import { useFieldPresentation } from '../FieldTemplate/useFieldPresentation';
import styles from './TableLayout.module.scss';

export const tableStyle = (table: TableLayout): CSSProperties =>
	({ '--schema-form-table-columns': table.columns.length, '--schema-form-table-actions-width': table.removable ? 'var(--icon-button-height-regular)' : '0px' } as CSSProperties);

export const TableHeader = ({ table }: { table: TableLayout }) => (
	<div role="row" className={styles.TableHeader} style={tableStyle(table)} data-grip={table.reserveGrip || undefined}>
		<span role="columnheader" className={styles.Hidden}>
			{SCHEMA_FORM_STRINGS.row}
		</span>
		{table.columns.map((column, index) => (
			<div
				key={column.name}
				id={`${table.id}-column-${index}`}
				role="columnheader"
				aria-label={column.required ? `${column.title}, ${SCHEMA_FORM_STRINGS.required}` : column.title}
				aria-colindex={index + 2}
				className={styles.ColumnHeader}
			>
				<span>{column.title}</span>
				{column.required && (
					<span aria-hidden="true" className={styles.Required}>
						*
					</span>
				)}
				<FieldHelp className={styles.HeaderHelp} help={column.description} accessibleLabel={SCHEMA_FORM_STRINGS.helpFor(column.title)} />
			</div>
		))}
		<span id={`${table.id}-actions`} role="columnheader" aria-colindex={table.columns.length + 2} className={styles.Hidden}>
			{SCHEMA_FORM_STRINGS.actions}
		</span>
	</div>
);

export const TableItemField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const { errorsElement } = useFieldPresentation(props);
	const row = useContext(TableRowContext)!;
	return (
		<>
			{props.children}
			<div id={`${row.rowHeaderId}-errors`} className={styles.RowErrors}>
				{errorsElement}
			</div>
		</>
	);
};

export const TableObjectCells = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	properties,
	idSchema
}: Pick<ObjectFieldTemplateProps<T, S, F>, 'properties' | 'idSchema'>) => {
	const row = useContext(TableRowContext)!;
	return (
		<>
			{row.table.columns.map((column, index) => {
				const property = properties.find(property => property.name === column.name);
				return (
					<div
						key={column.name}
						role="cell"
						aria-colindex={index + 2}
						aria-labelledby={`${row.table.id}-column-${index} ${row.rowHeaderId}`}
						className={styles.TableCell}
						data-table-cell={column.name}
					>
						<TableCellContext.Provider value={{ fieldId: get(idSchema, [column.name, '$id']), column, accessibleLabel: `${column.title}, ${row.itemName}` }}>
							{property?.content}
						</TableCellContext.Provider>
					</div>
				);
			})}
			{properties
				.filter(property => property.hidden)
				.map(property => (
					<div key={property.name} hidden>
						{property.content}
					</div>
				))}
		</>
	);
};
