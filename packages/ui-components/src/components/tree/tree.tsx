import { Component, Event, EventEmitter, Fragment, Host, Prop, h } from '@stencil/core';

import { EIconName } from '../icon/icon.types';
import { ETreeItemLabelSize } from '../../types';
import { ITreeNodeItem } from './tree.types';
import { get } from 'lodash-es';

/**
 * @part tree - The tree container.
 * @part tree-item - The tree item container.
 */
@Component({
	tag: 'kv-tree',
	styleUrl: 'tree.scss',
	shadow: true
})
export class KvTree {
	/** (required) The tree hierarchy items to render in this component */
	@Prop() nodes!: ITreeNodeItem[];
	/** (optional) Defines whether the all tree nodes is loading. */
	@Prop({ reflect: true }) loading? = false;
	/** (optional) The currently selected node id */
	@Prop() selectedNode?: string;

	/** (optional) Dictionary that defines whether the tree node is hidden. */
	@Prop({ reflect: true }) hiddenNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is expanded or collapsed. Only has visual effect for tree nodes with children. */
	@Prop({ reflect: true }) expandedNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is spotlight. Only has visual effect for tree nodes with children and expanded. */
	@Prop({ reflect: true }) spotlightedNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is disabled. */
	@Prop({ reflect: true }) disabledNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is highlighted. */
	@Prop({ reflect: true }) highlightedNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is loading. */
	@Prop({ reflect: true }) loadingNodes?: { [key: string]: boolean };
	/** (optional) Defines the font size of title and subtitle labels.*/
	@Prop({ reflect: true }) labelsSize?: ETreeItemLabelSize;
	/** (optional) Defines if icon to use for expanding, should be and arrow like icon pointing up. */
	@Prop({ reflect: true }) expandIcon?: EIconName;
	/** (optional) Defines whether the label should be displayed as tooltip.*/
	@Prop({ reflect: true }) showTooltip?: boolean;
	/** (optional) Delay to show tooltip in milliseconds. */
	@Prop({ reflect: true }) tooltipDelay?: number;

	/** Emitted when the node expand toggle is clicked */
	@Event() nodeToggleExpand: EventEmitter<ITreeNodeItem>;
	/** Emitted when the tree node item is clicked */
	@Event() nodeClick: EventEmitter<ITreeNodeItem>;

	private onItemClick = (item: ITreeNodeItem) => this.nodeClick.emit(item);

	private onToggleExpand = (item: ITreeNodeItem) => this.nodeToggleExpand.emit(item);

	private drawNodes(nodes: ITreeNodeItem[]) {
		return (
			<Fragment>
				{nodes.map(
					item =>
						!get(this.hiddenNodes, [item.id], false) && (
							<kv-tree-item
								slot="child-slot"
								label={item.label}
								additionalLabel={item.additionalLabel}
								placeholder={item.placeholder}
								labelsSize={this.labelsSize}
								icon={item.icon}
								iconState={item.iconState}
								counter={item.counter}
								counterState={item.counterState}
								hasChildren={item.lazyLoadChildren}
								selected={this.selectedNode === item.id}
								expanded={get(this.expandedNodes, [item.id], false)}
								disabled={get(this.disabledNodes, [item.id], false)}
								preventDefault={item.preventDefault}
								highlighted={get(this.highlightedNodes, [item.id], false)}
								spotlighted={get(this.spotlightedNodes, [item.id], false)}
								expandIcon={this.expandIcon}
								loading={this.loading || get(this.loadingNodes, [item.id], false)}
								onItemClick={_ => this.onItemClick(item)}
								onToggleExpand={_ => this.onToggleExpand(item)}
								showTooltip={this.showTooltip}
								tooltipDelay={this.tooltipDelay}
								part="tree-item"
								exportparts="icon,children"
							>
								{item.children?.length > 0 && this.drawNodes(item.children)}
							</kv-tree-item>
						)
				)}
			</Fragment>
		);
	}

	render() {
		return (
			<Host>
				<div class="container" part="tree">
					{this.nodes?.length > 0 && this.drawNodes(this.nodes)}
				</div>
			</Host>
		);
	}
}
