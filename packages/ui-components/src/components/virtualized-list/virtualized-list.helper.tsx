import { VNode, h } from '@stencil/core';
import { RenderItemFunc } from './virtualized-list.types';

export const buildElement = (index: number, key: string, height: number, top: number, renderItem: RenderItemFunc): VNode => {
	return (
		<div
			key={key}
			class="item"
			style={{
				transform: `translate(0px,${top}px)`,
				height: `${height}px`,
				width: '100%'
			}}
		>
			{renderItem(index)}
		</div>
	);
};
