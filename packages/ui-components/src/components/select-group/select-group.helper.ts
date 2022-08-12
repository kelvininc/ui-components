import { groupBy, isEmpty } from 'lodash-es';
import { EMPTY_GROUP_NAME, NO_GROUP_NAME } from './select-group.config';

export const buildSelectGroups = <T extends { group?: string }>(options: Record<string, T>): Record<string, T[]> => {
	/**
	 * Note: All options that do not contain a `group` filed will be aggregated on an `undefined` (EMPTY_GROUP_NAME) group name.
	 */
	return groupBy(Object.values(options), 'group');
};

export const buildSelectGroupLabel = (groupName: string): string => {
	if (isEmpty(groupName) || groupName === EMPTY_GROUP_NAME) {
		return NO_GROUP_NAME;
	}

	return groupName;
};
