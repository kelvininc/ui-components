import { createContext, useContext } from 'react';

export const SectionDepthContext = createContext(0);
export const useSectionDepth = () => useContext(SectionDepthContext);
export const getSectionHeadingLevel = (depth: number): 2 | 3 | 4 | 5 | 6 => Math.min(Math.max(2 + depth, 2), 6) as 2 | 3 | 4 | 5 | 6;
