import { createContext, RefObject } from 'react';

/** A single field's core radio host; clear actions use its public focus method. */
export const ChoiceControlContext = createContext<RefObject<HTMLKvRadioListElement | null> | null>(null);
