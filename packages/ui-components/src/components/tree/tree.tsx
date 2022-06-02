import { Component, Host, h, Prop, Event, EventEmitter, Fragment, State } from '@stencil/core';
import { get } from 'lodash-es';
import { EDropType } from '../tree-item/tree-item.types';
import { IAllowDragFn, IAllowDropFn, ITreeNodeItem } from './tree.types';

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

	/** (optional) Dictionary that defines whether the tree node is hidden.*/
	@Prop({ reflect: true }) hiddenNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is expanded or collapsed. Only has visual effect for tree nodes with children.*/
	@Prop({ reflect: true }) expandedNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is disabled.*/
	@Prop({ reflect: true }) disabledNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is highlighted.*/
	@Prop({ reflect: true }) highlightedNodes?: { [key: string]: boolean };
	/** (optional) Dictionary that defines whether the tree node is loading. */
	@Prop({ reflect: true }) loadingNodes?: { [key: string]: boolean };

	/** Specify if dragging tree nodes is allowed. This could be a boolean, or a function that receives a TreeNode and returns a boolean */
	@Prop() allowDrag?: boolean | IAllowDragFn;

	/** Specify whether dropping inside the tree is allowed. Optional types:
	 *  - boolean
	 *  - (element:any, to:{parent:TreeNode, index:number}):boolean
		  A function that receives the dragged element, and the drop location (parent node and index inside the parent),
		  and returns true or false.

	 * **Default Value: true**
	*/
	@Prop() allowDrop?: boolean | IAllowDropFn;

	/** Emitted when the node expand toggle is clicked */
	@Event() nodeToggleExpand: EventEmitter<ITreeNodeItem>;
	/** Emitted when the tree node item is clicked */
	@Event() nodeClick: EventEmitter<ITreeNodeItem>;

	/** Internal drag tree item state */
	@State() nodeOnDrag: ITreeNodeItem;

	/** Internal allow drop tree item state */
	@State() allowDropDic: {[key:string]: boolean} = {};

	private onDragNodeStart = (item: ITreeNodeItem) => {
		this.nodeOnDrag = item;
		this.allowDropDic = {};
	};
	private onDragNodeEnd = () => (this.nodeOnDrag = null);

	private onItemClick = (item: ITreeNodeItem) => this.nodeClick.emit(item);

	private onToggleExpand = (item: ITreeNodeItem) => this.nodeToggleExpand.emit(item);

	private onDragOver = (type: CustomEvent<EDropType>, source: ITreeNodeItem, target: ITreeNodeItem, parent: ITreeNodeItem, index: number) => {
		// console.log('TREE onDragOver type:', type.detail);
		// console.log('\t source:', source);
		// console.log('\t target:', target);
		// console.log('\t parent:', parent, index);
		if (typeof this.allowDrop === 'boolean') {
			return this.allowDrop;
		} else {
			let toData;
			if (type.detail === EDropType.None) {
				return;
			} else if (type.detail === EDropType.Inside) {
				toData = {
					parent: target,
					index: 0
				};
			} else {
				toData = {
					parent,
					index: type.detail === EDropType.Up ? index - 1 : index + 1
				};
			}

			this.allowDropDic={
				...this.allowDropDic,
				[target.id]: this.allowDrop(source, toData)
			};
			console.log('allowDropDic', this.allowDropDic);
		}
	};

	private _allowDrag = (item: ITreeNodeItem) => {
		if (typeof this.allowDrag === 'boolean') {
			return this.allowDrag;
		} else {
			return this.allowDrag(item);
		}
	};

	private drawNodes(nodes: ITreeNodeItem[], parent: ITreeNodeItem = null) {
		return (
			<Fragment>
				{nodes.map(
					(item, index) =>
						!get(this.hiddenNodes, [item.id], false) && (
							<kv-tree-item
								slot="child-slot"
								label={item.label}
								additionalLabel={item.additionalLabel}
								placeholder={item.placeholder}
								icon={item.icon}
								iconState={item.iconState}
								counter={item.counter}
								counterState={item.counterState}
								hasChildren={item.lazyLoadChildren}
								selected={this.selectedNode === item.id}
								expanded={get(this.expandedNodes, [item.id], false)}
								disabled={get(this.disabledNodes, [item.id], false)}
								highlighted={get(this.highlightedNodes, [item.id], false)}
								loading={this.loading || get(this.loadingNodes, [item.id], false)}
								allowDrag={this._allowDrag(item)}
								allowDrop={get(this.allowDropDic,[item.id], false)}
								onItemClick={_ => this.onItemClick(item)}
								onToggleExpand={_ => this.onToggleExpand(item)}
								onDragOverItem={type => this.onDragOver(type, this.nodeOnDrag, item, parent, index)}
								onDragStartItem={_ => this.onDragNodeStart(item)}
								onDragEndItem={_ => this.onDragNodeEnd()}
							>
								{item.children?.length > 0 && this.drawNodes(item.children, item)}
							</kv-tree-item>
						)
				)}
			</Fragment>
		);
	}

	render() {
		return <Host>{this.nodes?.length > 0 && this.drawNodes(this.nodes)}</Host>;
	}
}
