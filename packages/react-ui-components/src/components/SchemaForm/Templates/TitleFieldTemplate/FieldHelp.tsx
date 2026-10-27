import { EActionButtonType, EComponentSize, EIconName, ETooltipPosition } from '@kelvininc/ui-components';
import React from 'react';
import classNames from 'classnames';
import { KvActionButtonIcon, KvToggleTip } from '../../../../stencil-generated';
import styles from './FieldHelp.module.scss';

// One compact look for every help tip (headings, table headers and bare list items), always a named button keyboards can reach
const FieldHelp = ({ help, className, accessibleLabel }: { help?: string; className?: string; accessibleLabel: string }) =>
	help ? (
		<KvToggleTip className={classNames(styles.FieldHelp, className)} text={help} position={ETooltipPosition.Right}>
			<KvActionButtonIcon
				icon={EIconName.InfoOutline}
				type={EActionButtonType.Tertiary}
				size={EComponentSize.Small}
				accessibleLabel={accessibleLabel}
				slot="open-element-slot"
			/>
		</KvToggleTip>
	) : null;

export default FieldHelp;
