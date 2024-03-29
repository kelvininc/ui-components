import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

import { EIconName } from '../icon/icon.types';
import { ETreeItemLabelSize } from '../../types';
import { ITreeNodeItem } from '../tree/tree.types';

@Component({
	tag: 'kv-tree-dropdown',
	styleUrl: 'tree-dropdown.scss',
	shadow: true
})
export class KvTreeDropdown {
	/** (required) The tree hierarchy items to render in this component */
	@Prop() nodes!: ITreeNodeItem[];

	/** (optional) Defines whether the all tree nodes is loading. */
	@Prop({ reflect: true }) loading? = false;
	/** (optional) The currently selected node id */
	@Prop() selectedNode?: string;

	/** (optional) Dictionary that defines whether the tree node is hidden.*/
	@Prop({ reflect: true }) hiddenNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is expanded or collapsed. Only has visual effect for tree nodes with children.*/
	@Prop({ reflect: true }) expandedNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is disabled.*/
	@Prop({ reflect: true }) disabledNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is loading. */
	@Prop({ reflect: true }) loadingNodes?: { [key: string]: boolean };
	/** (optional) Defines whether the labels should be displayed as tooltip.*/
	@Prop({ reflect: true }) showTooltip?: boolean;
	/** (optional) Delay to show tooltip in milliseconds. */
	@Prop({ reflect: true }) tooltipDelay?: number;

	/** Emitted when the node expand toggle is clicked */
	@Event() nodeToggleExpand: EventEmitter<ITreeNodeItem>;
	/** Emitted when the tree node item is clicked */
	@Event() nodeClick: EventEmitter<ITreeNodeItem>;

	private getHighlightedNodes(node: ITreeNodeItem) {
		return node.children?.length >= 0 ? { [node.id]: true } : {};
	}

	private getSpotlightedNodes() {
		const node = this.nodes.find(node => node.children?.find(child => child.id === this.selectedNode));

		if (!node) {
			return {};
		}

		return { [node.id]: true };
	}

	render() {
		return (
			<Host>
				{this.nodes.map(node => (
					<kv-tree
						class={{ tree: true, expanded: this.expandedNodes[node.id], nochildren: !node?.children }}
						nodes={[node]}
						loading={this.loading}
						selectedNode={this.selectedNode}
						hiddenNodes={this.hiddenNodes}
						expandedNodes={this.expandedNodes}
						spotlightedNodes={this.getSpotlightedNodes()}
						labelsSize={ETreeItemLabelSize.Regular}
						expandIcon={EIconName.Collapse}
						disabledNodes={this.disabledNodes}
						highlightedNodes={this.getHighlightedNodes(node)}
						loadingNodes={this.loadingNodes}
						showTooltip={this.showTooltip}
						tooltipDelay={this.tooltipDelay}
					></kv-tree>
				))}
			</Host>
		);
	}
}
