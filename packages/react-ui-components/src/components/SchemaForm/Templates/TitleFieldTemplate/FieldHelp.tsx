import { EIconName, ETooltipPosition } from '@kelvininc/ui-components';
import React from 'react';
import classNames from 'classnames';
import { KvIcon, KvToggleTip } from '../../../../stencil-generated';
import styles from './FieldHelp.module.scss';

// The library's toggle tip: a bare info icon that opens the help on click, for headings, table headers and bare list items
const FieldHelp = ({ help, className }: { help?: string; className?: string }) =>
	help ? (
		<KvToggleTip className={classNames(styles.FieldHelp, className)} text={help} position={ETooltipPosition.Right}>
			<KvIcon name={EIconName.InfoOutline} slot="open-element-slot" />
		</KvToggleTip>
	) : null;

export default FieldHelp;
