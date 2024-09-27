import { ComputePositionConfig } from '@floating-ui/dom';
import { isArray, mergeWith, unionWith } from 'lodash-es';

export const mergeComputePositionConfigs = (config1: Partial<ComputePositionConfig>, config2: Partial<ComputePositionConfig>): Partial<ComputePositionConfig> =>
	mergeWith({}, config1, config2, (objValue, srcValue) => {
		if (isArray(objValue)) {
			return unionWith(srcValue, objValue, (a, b) => a.name === b.name);
		}
	});
