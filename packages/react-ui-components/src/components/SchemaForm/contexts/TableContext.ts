import { createContext, useContext } from 'react';
import type { EComponentSize } from '@kelvininc/ui-components';
import type { TableColumn } from '../Templates/utils';

export type TableLayout = { id: string; columns: TableColumn[]; reserveGrip: boolean; removable: boolean; size: EComponentSize };
export const TableContext = createContext<TableLayout | null>(null);
export const TableRowContext = createContext<{ fieldId: string; itemName: string; rowHeaderId: string; table: TableLayout } | null>(null);
export const TableCellContext = createContext<{ fieldId: string; column: TableColumn; accessibleLabel: string } | null>(null);
export const useTableCell = (id: string) => {
	const cell = useContext(TableCellContext);
	return cell?.fieldId === id ? cell : null;
};
