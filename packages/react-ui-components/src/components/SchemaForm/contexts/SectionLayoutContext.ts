import { createContext, useContext } from 'react';

export type SectionBoundaryKind = 'section' | 'item' | 'option';
export type SectionHeadingKind = 'major' | 'subsection';
export type SectionLayoutState = Readonly<{
	sectionLevel: number;
	itemLevel: number;
	boundaryDepth: number;
	owner?: Readonly<{ fieldId: string; kind: SectionBoundaryKind }>;
}>;
export type SectionBoundaryResult = Readonly<{
	state: SectionLayoutState;
	boundary: Readonly<{ kind: SectionBoundaryKind; depth: number }> | null;
}>;

export const ROOT_SECTION_LAYOUT: SectionLayoutState = Object.freeze({ sectionLevel: 0, itemLevel: 0, boundaryDepth: 0 });
export const SectionLayoutContext = createContext<SectionLayoutState>(ROOT_SECTION_LAYOUT);
export const SectionHeadingContext = createContext<SectionHeadingKind>('major');
export const useSectionLayout = () => useContext(SectionLayoutContext);

export const claimSectionBoundary = (parent: SectionLayoutState, fieldId: string, kind: SectionBoundaryKind): SectionBoundaryResult => {
	// Only the enclosed field reuses a guide; nested option wrappers can share an id.
	if (kind === 'section' && parent.owner?.fieldId === fieldId) return { state: parent, boundary: null };
	const depth = parent.boundaryDepth + 1;
	return {
		state: { ...parent, boundaryDepth: depth, itemLevel: parent.itemLevel + Number(kind === 'item'), owner: { fieldId, kind } },
		boundary: { kind, depth }
	};
};

export const sectionBodyLayout = ({ owner, ...state }: SectionLayoutState): SectionLayoutState => ({ ...state, sectionLevel: state.sectionLevel + 1 });

export const getSectionHeadingKind = (state: SectionLayoutState, isItemTitle: boolean): SectionHeadingKind =>
	(isItemTitle && state.itemLevel === 1) || (!isItemTitle && state.sectionLevel <= 1 && state.itemLevel === 0) ? 'major' : 'subsection';
