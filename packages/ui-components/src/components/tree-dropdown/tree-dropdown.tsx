import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

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

	/** Emitted when the node expand toggle is clicked */
	@Event() nodeToggleExpand: EventEmitter<ITreeNodeItem>;
	/** Emitted when the tree node item is clicked */
	@Event() nodeClick: EventEmitter<ITreeNodeItem>;

	private getHighlightedNodes(node: ITreeNodeItem) {
		return node.children?.length >= 0 ? { [node.id]: true } : {};
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
						disabledNodes={this.disabledNodes}
						highlightedNodes={this.getHighlightedNodes(node)}
						loadingNodes={this.loadingNodes}
					></kv-tree>
				))}
			</Host>
		);
	}
}
