import { ErrorSchema } from '@rjsf/utils';
import { createContext } from 'react';

/** RJSF's file-array widget receives only array-level rawErrors. Keep its item errors scoped here. */
export const FileArrayErrorsContext = createContext<{ fieldId: string; errorSchema?: ErrorSchema } | null>(null);
