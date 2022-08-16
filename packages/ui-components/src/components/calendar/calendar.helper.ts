import { getMonthName } from '../../utils/date.helper';

export const getMonthTitle = (month: number, year: number): string => `${getMonthName(month)} ${year}`;
