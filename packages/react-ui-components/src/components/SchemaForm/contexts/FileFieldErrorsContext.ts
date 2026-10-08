import { createContext, ReactNode } from 'react';

/** FileWidget places the field template's mounted errors between its cards and picker. */
export const FileFieldErrorsContext = createContext<{ fieldId: string; errors: ReactNode } | null>(null);
