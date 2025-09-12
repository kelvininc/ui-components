import React from 'react';
import { KvRange } from '@kelvininc/react-ui-components/client';

export const KvRangeExample: React.FC = () => (
  <>
	<KvRange min={0} max={100} step={1} value={0} />
  </>
);
