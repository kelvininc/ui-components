import { createContext } from 'react';

export type ReportOptionSection = (fieldId: string, instance: symbol, section: boolean | undefined) => void;

/** Each object owns reports from the union branches it renders. */
export const OptionSectionContext = createContext<ReportOptionSection | undefined>(undefined);
